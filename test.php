<?php
/**
 * Plugin Name: PWA Extension (User + Notifications)
 * Description: Adds user approval, login tracking, and notification integration.
 * Version: 1.0
 * Author: Ayoub Berouijil
 */

if (!defined('ABSPATH')) exit;

// Check WordPress version compatibility
if (version_compare(get_bloginfo('version'), '5.0', '<')) {
    add_action('admin_notices', function() {
        echo '<div class="notice notice-error"><p><strong>PWA Extension:</strong> This plugin requires WordPress 5.0 or higher.</p></div>';
    });
    return;
}

// Function compatibility checks disabled for older WordPress versions
// The plugin will use fallback methods for missing functions

add_action('init', function() {
    if (!defined('COOKIEPATH')) define('COOKIEPATH', '/');
    if (!defined('SITECOOKIEPATH')) define('SITECOOKIEPATH', '/');
    if (!defined('COOKIE_DOMAIN')) {
        // Use the full domain for cookies to work across all pages
        $domain = $_SERVER['HTTP_HOST'];
        // Remove www. prefix if present for consistency
        if (strpos($domain, 'www.') === 0) {
            $domain = substr($domain, 4);
        }
        // Use the domain without dot prefix for better compatibility
        define('COOKIE_DOMAIN', $domain);
    }
});

add_filter('send_auth_cookies', '__return_true');
add_filter('wp_session_tokens_set_cookie_args', function($args){
    $args['samesite'] = 'Lax'; // Changed from 'None' to 'Lax' for better compatibility
    $args['secure'] = is_ssl();
    $args['httponly'] = true;
    return $args;
});

// Ensure auth cookies are set with proper domain and path
add_filter('auth_cookie', function($cookie, $user_id, $expiration, $scheme, $token) {
    return $cookie;
}, 10, 5);

// Force cookie settings for better persistence
add_action('wp_login', function($user_login, $user) {
    // Ensure cookies are set with proper domain
    if (!headers_sent()) {
        $secure = is_ssl();
        $domain = defined('COOKIE_DOMAIN') ? COOKIE_DOMAIN : $_SERVER['HTTP_HOST'];
        
        // Set additional cookie parameters for better persistence
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', $secure ? 1 : 0);
    }
}, 10, 2);


// === Add extra fields to registration form ===
add_action('register_form', function() {
    ?>
    <p>
        <label for="work_for">Who do you work for?<br/>
        <input type="text" name="work_for" id="work_for" class="input" size="25" /></label>
    </p>
    <?php
});

add_action('user_register', function($user_id) {
    if (isset($_POST['work_for'])) {
        update_user_meta($user_id, 'work_for', sanitize_text_field($_POST['work_for']));
    }
    update_user_meta($user_id, '_pwa_approved', 0);
    $user = new WP_User($user_id);
    // $user->set_role('pending_user');
});

// === Block login if user not approved ===
add_filter('authenticate', function($user) {
    if ($user instanceof WP_User) {
        $approved = get_user_meta($user->ID, '_pwa_approved', true);
        if (!$approved) {
            return new WP_Error('not_approved', __('Your account is pending approval.'));
        }
    }
    return $user;
}, 30);

// === Track last login time ===
add_action('wp_login', function($user_login, $user) {
    update_user_meta($user->ID, 'last_login', current_time('timestamp'));
}, 10, 2);

// === Helper to check if user is active ===
function pwa_is_user_active($user_id, $days = 7) {
    $last = (int) get_user_meta($user_id, 'last_login', true);
    return $last && (time() - $last) <= $days * DAY_IN_SECONDS;
}

// === Add admin column for approval + activity ===
// add_filter('manage_users_columns', function($cols) {
//     $cols['work_for'] = 'Who they work for';
//     $cols['last_login'] = 'Last Login';
//     $cols['active'] = 'Active?';
//     $cols['approval'] = 'Approval';
//     return $cols;
// });

// add_filter('manage_users_custom_column', function($value, $column_name, $user_id) {
//     if ($column_name === 'work_for') {
//         return esc_html(get_user_meta($user_id, 'work_for', true));
//     }
//     if ($column_name === 'last_login') {
//         $last = get_user_meta($user_id, 'last_login', true);
//         return $last ? date('Y-m-d H:i', $last) : '-';
//     }
//     if ($column_name === 'active') {
//         return pwa_is_user_active($user_id) ? '✅ Active' : '❌ Inactive';
//     }
//     if ($column_name === 'approval') {
//         $user = get_userdata($user_id);
//         if (in_array('pending_user', $user->roles)) {
//             $approve_url = wp_nonce_url(admin_url('users.php?action=pwa_approve&user_id=' . $user_id), 'pwa_approve_' . $user_id);
//             return '<a href="' . $approve_url . '" class="button">Approve</a>';
//         }
//         return 'Approved';
//     }
//     return $value;
// }, 10, 3);


add_action('admin_init', function() {
    if (isset($_GET['action']) && $_GET['action'] === 'pwa_approve' && current_user_can('edit_users')) {
        $user_id = intval($_GET['user_id']);
        check_admin_referer('pwa_approve_' . $user_id);
        $user = new WP_User($user_id);
        $user->set_role('subscriber');
        wp_redirect(admin_url('users.php?approved=1'));
        exit;
    }
});


// === Logout Button Shortcode ===
add_shortcode('logout_button', function() {
    if (is_user_logged_in()) {
        $logout_url = wp_logout_url(home_url());
        return '<div style="text-align:center;margin:20px;">
            <a href="'.esc_url($logout_url).'" class="button" 
               style="background:#f44336;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
               Logout
            </a>
        </div>';
    }
    return '';
});

// === REGEX SAFE EXIT ===
if (!defined('ABSPATH')) exit;

/* -------------------------------------------------------
 * AUTH HELPERS
 * ----------------------------------------------------- */
function pwa_render_notice($type, $msg){
    $colors = $type === 'error' ? 'background:#fee2e2;color:#991b1b;border-color:#fecaca' : 'background:#ecfdf5;color:#065f46;border-color:#a7f3d0';
    return '<div style="border:1px solid;'.$colors.';padding:12px;border-radius:10px;margin:10px 0;">'.esc_html($msg).'</div>';
}

function pwa_card_open($title){
    return '
    <div style="max-width:420px;margin:20px auto;padding:24px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.07);background:white">
      <h2 style="margin:0 0 14px;font-weight:700;font-size:22px;">'.esc_html($title).'</h2>
      <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">Dowhigh Portal</div>
      <hr style="border:none;border-top:1px solid #eee;margin:12px 0 18px;">
    ';
}
function pwa_card_close(){ return '</div>'; }

function pwa_input($label, $name, $type='text', $value=''){
    $id = esc_attr($name);
    return '
      <label for="'.$id.'" style="display:block;font-weight:600;margin:10px 0 6px;">'.esc_html($label).'</label>
      <input type="'.esc_attr($type).'" name="'.$id.'" id="'.$id.'" value="'.esc_attr($value).'"
        style="width:100%;padding:12px 14px;border:1px solid #e5e7eb;border-radius:10px;outline:none"
      />
    ';
}
function pwa_button($text){
    return '<button type="submit" style="width:100%;margin-top:14px;background:#111827;color:white;border:none;padding:12px;border-radius:12px;font-weight:600;cursor:pointer">'
      .esc_html($text).'</button>';
}

/* -------------------------------------------------------
 * SHORTCODE: [pwa_register_form]
 * ----------------------------------------------------- */
add_shortcode('pwa_register_form', function(){
    if (is_user_logged_in()) {
        return pwa_render_notice('ok','You are already logged in.');
    }
    $out = pwa_card_open('Create your account');

    if ($_SERVER['REQUEST_METHOD']==='POST' && isset($_POST['pwa_register_nonce']) && wp_verify_nonce($_POST['pwa_register_nonce'],'pwa_register')) {
        $username = sanitize_user($_POST['username'] ?? '');
        $email    = sanitize_email($_POST['email'] ?? '');
        $pass     = $_POST['password'] ?? '';
        $work_for = sanitize_text_field($_POST['work_for'] ?? '');
        $name     = sanitize_text_field($_POST['full_name'] ?? '');

        if (!$username || !$email || !$pass || !$work_for) {
            $out .= pwa_render_notice('error','Please fill all required fields.');
        } elseif (username_exists($username) || email_exists($email)) {
            $out .= pwa_render_notice('error','Username or email already exists.');
        } else {
            $user_id = wp_create_user($username, $pass, $email);
           if (is_wp_error($user_id)) {
    $out .= pwa_render_notice('error', wp_strip_all_tags($user_id->get_error_message(), true));
}
 else {
                if ($name) {
                    wp_update_user(['ID'=>$user_id,'display_name'=>$name]);
                }
                update_user_meta($user_id,'work_for',$work_for);
                $u = new WP_User($user_id);
                $u->set_role('pending_user'); // must be approved by backoffice
                $out .= pwa_render_notice('ok','Account created. Await backoffice approval before login.');
            }
        }
    }

    $out .= '<form method="post">';
    $out .= pwa_input('Full name','full_name');
    $out .= pwa_input('Username *','username');
    $out .= pwa_input('Email *','email','email');
    $out .= pwa_input('Password *','password','password');
    $out .= pwa_input('Who do you work for? *','work_for');
    $out .= wp_nonce_field('pwa_register','pwa_register_nonce',true,false);
    $out .= pwa_button('Create account');
$out .= '<div style="text-align:center;margin-top:10px;font-size:14px">
  Already have an account? <a href="'.esc_url(home_url('/login/')).'">Sign in</a>
</div>';
    $out .= '</form>';

    $out .= pwa_card_close();
    return $out;
});

/* -------------------------------------------------------
 * SHORTCODE: [pwa_login_form]
 * ----------------------------------------------------- */
// Handle login processing before any output
add_action('init', function() {
    if (
        $_SERVER['REQUEST_METHOD'] === 'POST' &&
        isset($_POST['pwa_login_nonce']) &&
        wp_verify_nonce($_POST['pwa_login_nonce'], 'pwa_login')
    ) {
        // --- Logging setup ---
        $log_file = WP_CONTENT_DIR . '/pwa_login_debug.log';
        file_put_contents($log_file, "=== LOGIN ATTEMPT ".date('Y-m-d H:i:s')." ===\n", FILE_APPEND);
        file_put_contents($log_file, "Login input: ".sanitize_text_field($_POST['user_login'] ?? '')."\n", FILE_APPEND);

        // Make cookie expire and apply site-wide
        add_filter('auth_cookie_expiration', function ($expirein) {
            return 14 * DAY_IN_SECONDS;
        });

        $creds = [
            'user_login'    => sanitize_text_field($_POST['user_login'] ?? ''),
            'user_password' => $_POST['user_pass'] ?? '',
            'remember'      => !empty($_POST['remember']),
        ];

        // Clear any old session
        wp_clear_auth_cookie();
        file_put_contents($log_file, "Cleared old auth cookies.\n", FILE_APPEND);

        // Use WordPress standard authentication
        $user = wp_authenticate($creds['user_login'], $creds['user_password']);

        if (is_wp_error($user)) {
            $error_msg   = wp_strip_all_tags($user->get_error_message(), true);
            $error_codes = implode(', ', $user->get_error_codes());
            file_put_contents($log_file, "❌ Login failed. Codes: {$error_codes}. Msg: {$error_msg}\n\n", FILE_APPEND);
            
            // Store error in session for display
            if (!session_id()) session_start();
            $_SESSION['pwa_login_error'] = 'Login failed (codes: '.$error_codes.'). '.$error_msg;
        } else {
            file_put_contents($log_file, "✅ Login succeeded for user ID {$user->ID}\n", FILE_APPEND);

            // Use WordPress standard login process
            wp_set_current_user($user->ID);
            wp_set_auth_cookie($user->ID, !empty($creds['remember']));
            
            // Fire the wp_login action
            do_action('wp_login', $user->user_login, $user);
            file_put_contents($log_file, "🍪 Auth cookies set and wp_login fired.\n", FILE_APPEND);

            // Force no cache headers
            nocache_headers();
            file_put_contents($log_file, "Sent no-cache headers.\n", FILE_APPEND);

            // Use wp_redirect for proper WordPress redirect
            file_put_contents($log_file, "Redirecting to /app/ using wp_redirect\n\n", FILE_APPEND);
            wp_redirect(home_url('/app/'));
            exit;
        }
    }
});

add_shortcode('pwa_login_form', function () {
    if (is_user_logged_in()) {
        return pwa_render_notice('ok', 'You are already logged in.');
    }

    $out = pwa_card_open('Sign in');

    // Check for stored error message
    if (!session_id()) session_start();
    if (isset($_SESSION['pwa_login_error'])) {
        $out .= pwa_render_notice('error', $_SESSION['pwa_login_error']);
        unset($_SESSION['pwa_login_error']);
    }

    // Render login form
    $out .= '<form method="post">';
    $out .= pwa_input('Email or Username', 'user_login');
    $out .= pwa_input('Password', 'user_pass', 'password');
    $out .= '<label style="display:flex;align-items:center;gap:8px;margin-top:10px;">
              <input type="checkbox" name="remember" /> <span>Remember me</span>
            </label>';
    $out .= wp_nonce_field('pwa_login', 'pwa_login_nonce', true, false);
    $out .= pwa_button('Sign in');
    $out .= '<div style="text-align:center;margin-top:10px;font-size:14px">
              New here? <a href="'.esc_url(home_url('/register/')).'">Create an account</a>
            </div>';
    $out .= '</form>';

    $out .= pwa_card_close();
    return $out;
});

/* -------------------------------------------------------
 * SHORTCODE: [pwa_auth_links] — for public homepage header/hero
 * ----------------------------------------------------- */
add_shortcode('pwa_auth_links', function(){
    if (is_user_logged_in()) {
        return '<div style="display:flex;gap:12px;justify-content:center">
          <a href="'.esc_url(home_url('/app/')).'" style="background:#111827;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600">Open app</a>
          <a href="'.esc_url(wp_logout_url(home_url('/'))).'" style="background:#ef4444;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600">Logout</a>
        </div>';
    }
    return '<div style="display:flex;gap:12px;justify-content:center">
      <a href="'.esc_url(home_url('/login/')).'" style="background:#111827;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600">Sign in</a>
      <a href="'.esc_url(home_url('/register/')).'" style="background:#f3f4f6;color:#111827;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600;border:1px solid #e5e7eb">Create account</a>
    </div>';
});

/* -------------------------------------------------------
 * SHORTCODE: [pwa_app_home] — user dashboard placeholder
 * ----------------------------------------------------- */
add_shortcode('pwa_app_home', function () {
    // Diagnostic logging for /app/
$diag_log = WP_CONTENT_DIR . '/pwa_app_debug.log';
file_put_contents($diag_log, "=== APP PAGE ACCESS ".date('Y-m-d H:i:s')." ===\n", FILE_APPEND);
file_put_contents($diag_log, "is_user_logged_in(): ".(is_user_logged_in() ? 'yes' : 'no')."\n", FILE_APPEND);
file_put_contents($diag_log, "get_current_user_id(): ".get_current_user_id()."\n", FILE_APPEND);

// Check login cookie
if (isset($_COOKIE[LOGGED_IN_COOKIE])) {
    file_put_contents($diag_log, LOGGED_IN_COOKIE." present in \$_COOKIE.\n", FILE_APPEND);
} else {
    file_put_contents($diag_log, LOGGED_IN_COOKIE." NOT present in \$_COOKIE.\n", FILE_APPEND);
}
// Dump all cookies
file_put_contents($diag_log, '$_COOKIE Dump: '.json_encode($_COOKIE)."\n\n", FILE_APPEND);

    // 1) Absolutely disable page caching for this view (server caches, plugins, proxies)
    if (!defined('DONOTCACHEPAGE')) define('DONOTCACHEPAGE', true);
    nocache_headers();

    // 2) Simple authentication check - let WordPress handle it
    if (!is_user_logged_in()) {
        // Try to restore user from cookies using WordPress standard method
        $user_id = wp_validate_auth_cookie();
        if ($user_id) {
            wp_set_current_user($user_id);
        }
    }

    // 3) Still not logged in? show message with debug info
    if (!is_user_logged_in()) {
        $debug_info = '';
        if (current_user_can('manage_options')) {
            $debug_info = '<br><small>Debug: User ID: ' . get_current_user_id() . 
                         ' | Cookies: ' . (isset($_COOKIE[LOGGED_IN_COOKIE]) ? 'Present' : 'Missing') . 
                         ' | is_ssl(): ' . (is_ssl() ? 'Yes' : 'No') . '</small>';
        }
        return pwa_render_notice('error', 'Please sign in to continue.' . $debug_info);
    }

    // 4) Render the dashboard
    $user     = wp_get_current_user();
    $work_for = get_user_meta($user->ID, 'work_for', true);

    $html = pwa_card_open('Welcome back, '.$user->display_name);
    $html .= '<p style="margin:0 0 6px;color:#374151">Who you work for: <strong>'.esc_html($work_for ?: '-').'</strong></p>';
    $html .= '<p style="margin:0 0 16px;color:#374151">For now, available features: <strong>receive & send messages</strong>.</p>';
    $html .= '<div style="display:flex;gap:10px;flex-wrap:wrap">
                <a href="'.esc_url(home_url('/messages/')).'" style="background:#111827;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:600">Open Messages</a>
                <a href="'.esc_url(wp_logout_url(home_url('/'))).'" style="background:#ef4444;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:600">Logout</a>
              </div>';
    $html .= pwa_card_close();
    return $html;
});


/* -------------------------------------------------------
 * DB: messages table creation
 * ----------------------------------------------------- */
add_action('init', function(){
    global $wpdb;
    $table = $wpdb->prefix.'pwa_messages';
    
    // Check if table exists, if not create it
    if ($wpdb->get_var("SHOW TABLES LIKE '$table'") != $table) {
        $charset = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE $table (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          user_id BIGINT UNSIGNED NULL,
          audience VARCHAR(20) DEFAULT 'single',
          group_key VARCHAR(100) NULL,
          title VARCHAR(190) NOT NULL,
          body TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) $charset;";
        
        require_once ABSPATH.'wp-admin/includes/upgrade.php';
        dbDelta($sql);
        
        // Log table creation
        error_log('PWA Messages table created successfully');
    }
});

// Manual table creation function (can be called from admin)
function pwa_create_messages_table() {
    global $wpdb;
    $table = $wpdb->prefix.'pwa_messages';
    $charset = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE IF NOT EXISTS $table (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NULL,
      audience VARCHAR(20) DEFAULT 'single',
      group_key VARCHAR(100) NULL,
      title VARCHAR(190) NOT NULL,
      body TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) $charset;";
    
    require_once ABSPATH.'wp-admin/includes/upgrade.php';
    $result = dbDelta($sql);
    
    return $result;
}

/* -------------------------------------------------------
 * Admin Menu
 * ----------------------------------------------------- */
add_action('admin_menu', function(){
    add_menu_page('PWA Portal','PWA Portal','list_users','pwa-portal','pwa_portal_page','dashicons-admin-comments',58);
});
function pwa_portal_page() {
    if (!current_user_can('list_users')) {
        echo pwa_render_notice('error', 'You do not have permission to access this page.');
        return;
    }

    global $wpdb;

    echo '<div class="wrap"><h1>PWA Portal — Users & Messages</h1>';
    // Minimal styles + tabs container
    echo '<style>
      .pwa-tabs{margin-top:14px}
      .pwa-tab-nav{display:flex;gap:6px;margin:12px 0}
      .pwa-tab-btn{background:#f3f4f6;border:1px solid #e5e7eb;padding:8px 12px;border-radius:8px;cursor:pointer}
      .pwa-tab-btn.active{background:#111827;color:#fff;border-color:#111827}
      .pwa-tab-panel{display:none;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px}
      .pwa-tab-panel.active{display:block}
    </style>';
    echo '<div class="pwa-tabs">
      <div class="pwa-tab-nav">
        <button type="button" class="pwa-tab-btn active" data-tab="users">Users</button>
        <button type="button" class="pwa-tab-btn" data-tab="send">Send Message</button>
        <button type="button" class="pwa-tab-btn" data-tab="replies">User Replies (Live)</button>
      </div>
      <div class="pwa-tab-panel active" id="pwa-tab-users">';
    
    // Check if table exists and show button if not
    global $wpdb;
    $table = $wpdb->prefix.'pwa_messages';
    if ($wpdb->get_var("SHOW TABLES LIKE '$table'") != $table) {
        echo '<div style="background:#fff3cd;border:1px solid #ffeaa7;padding:15px;margin:20px 0;border-radius:5px;">';
        echo '<strong>Database Table Missing:</strong> The messages table doesn\'t exist. ';
        echo '<a href="?page=pwa-portal&create_table=1" class="button button-primary">Create Messages Table</a>';
        echo '</div>';
    }
    
    // Handle table creation
    if (isset($_GET['create_table']) && $_GET['create_table'] == '1') {
        $result = pwa_create_messages_table();
        if ($result) {
            echo '<div style="background:#d4edda;border:1px solid #c3e6cb;padding:15px;margin:20px 0;border-radius:5px;">';
            echo '<strong>Success:</strong> Messages table created successfully!';
            echo '</div>';
        } else {
            echo '<div style="background:#f8d7da;border:1px solid #f5c6cb;padding:15px;margin:20px 0;border-radius:5px;">';
            echo '<strong>Error:</strong> Failed to create messages table.';
            echo '</div>';
        }
    }

    /* -------------------------------------------------------
     * Handle User Approval
     * ----------------------------------------------------- */
    if (isset($_GET['pwa_approve_user']) && current_user_can('edit_users')) {
        $user_id = intval($_GET['pwa_approve_user']);
        update_user_meta($user_id, '_pwa_approved', 1);
        echo pwa_render_notice('ok', 'User #' . $user_id . ' approved successfully.');
    }

    /* -------------------------------------------------------
     * Handle Sending Message
     * ----------------------------------------------------- */
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pwa_send_message_nonce']) && wp_verify_nonce($_POST['pwa_send_message_nonce'], 'pwa_send_message')) {
        $audience = sanitize_text_field($_POST['audience'] ?? 'single');
        $user_id  = intval($_POST['user_id'] ?? 0);
        $group    = sanitize_text_field($_POST['group_key'] ?? '');
        $title    = sanitize_text_field($_POST['title'] ?? '');
        $body     = wp_kses_post($_POST['body'] ?? '');

        if ($title && $body) {
            $wpdb->insert($wpdb->prefix . 'pwa_messages', [
                'user_id'   => $audience === 'single' ? $user_id : null,
                'audience'  => $audience,
                'group_key' => $audience === 'group' ? $group : null,
                'title'     => $title,
                'body'      => $body,
            ]);

            // FCM + Firestore (per-user write and push)
            $service_account_path = WP_CONTENT_DIR . '/firebase-service-account.json';
            if (!file_exists($service_account_path)) {
                echo '<div style="background:red;color:white;padding:10px;margin:10px;">Firebase service account JSON file not found at: ' . esc_html($service_account_path) . '</div>';
                return;
            }

            $service_account = json_decode(file_get_contents($service_account_path), true);
            $project_id = isset($service_account['project_id']) ? $service_account['project_id'] : 'dowhigh';
            $access_token = pwa_get_firebase_access_token($service_account);
            if (!$access_token) {
                echo '<div style="background:red;color:white;padding:10px;margin:10px;">Failed to get Firebase access token.</div>';
                return;
            }

            // Build list of target user IDs
            $target_users = [];
            if ($audience === 'single' && $user_id) {
                $target_users = [intval($user_id)];
            } elseif ($audience === 'group' && $group) {
                $users = get_users([
                    'fields' => ['ID'],
                    'meta_query' => [[ 'key' => 'work_for', 'value' => $group, 'compare' => '=' ]],
                ]);
                foreach ($users as $u) { $target_users[] = intval($u->ID); }
            } else {
                $users = get_users(['fields' => ['ID']]);
                foreach ($users as $u) { $target_users[] = intval($u->ID); }
            }

            $results = [];
            foreach ($target_users as $tu_id) {
                // Firestore: POST to /documents/notifications/user_{id} to create auto-id doc
                $fs_endpoint = 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($project_id) . '/databases/(default)/documents/notifications/user_' . $tu_id;
                $fs_body = [
                    'fields' => [
                        'title'     => ['stringValue' => $title],
                        'message'   => ['stringValue' => $body],
                        'from'      => ['stringValue' => 'admin'],
                        'createdAt' => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')],
                    ]
                ];
                wp_remote_post($fs_endpoint, [
                    'headers' => ['Content-Type' => 'application/json'],
                    'body'    => wp_json_encode($fs_body),
                    'timeout' => 20,
                ]);

                // FCM push (if token exists)
                $token = get_user_meta($tu_id, '_fcm_token', true);
                if ($token) {
                    $resp = wp_remote_post('https://fcm.googleapis.com/v1/projects/' . $project_id . '/messages:send', [
                        'headers' => [
                            'Authorization' => 'Bearer ' . $access_token,
                            'Content-Type'  => 'application/json',
                        ],
                        'body'    => wp_json_encode([
                            'message' => [
                                'token' => $token,
                                'notification' => [ 'title' => $title, 'body' => $body ],
                                'data' => [ 'title' => $title, 'message' => $body, 'click_action' => home_url('/messages/') ],
                                'webpush' => [ 'fcm_options' => [ 'link' => home_url('/messages/') ] ],
                            ]
                        ]),
                        'timeout' => 20,
                    ]);
                    if (is_wp_error($resp)) {
                        $results[] = 'User #' . $tu_id . ': ' . $resp->get_error_message();
                    } else {
                        $results[] = 'User #' . $tu_id . ': HTTP ' . wp_remote_retrieve_response_code($resp);
                    }
                } else {
                    $results[] = 'User #' . $tu_id . ': no FCM token';
                }
            }

            echo '<div style="background:#16a34a;color:white;padding:10px;margin:10px;border-radius:6px;">Messages sent and saved to Firestore.</div>';
            foreach ($results as $r) {
                echo '<div style="background:#1d4ed8;color:white;padding:6px 8px;margin:4px 10px;border-radius:4px;">' . esc_html($r) . '</div>';
            }
        } else {
            echo pwa_render_notice('error', 'Title and Body are required.');
        }
    }

    /* -------------------------------------------------------
     * Users Table (Tab: Users)
     * ----------------------------------------------------- */
        $users = get_users([
            'fields'  => ['ID', 'display_name', 'user_email'],
            'orderby' => 'ID',
            'order'   => 'ASC',
        ]);
        
        echo '<h2 style="margin-top:20px">Users</h2>';
        echo '<table class="widefat fixed striped" style="max-width:1000px">';
        echo '<thead><tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Who they work for</th>
                <th>Last login</th>
                <th>Active?</th>
                <th>FCM Token</th>
                <th>Approval</th>
              </tr></thead><tbody>';
        
        foreach ($users as $u) {
            $work_for = get_user_meta($u->ID, 'work_for', true);
            $last = get_user_meta($u->ID, 'last_login', true);
            $active = pwa_is_user_active($u->ID) ? '✅' : '❌';
            $is_approved = get_user_meta($u->ID, '_pwa_approved', true);
            
            // Check FCM token status
            $fcm_token = get_user_meta($u->ID, '_fcm_token', true);
            $fcm_status = $fcm_token ? '🔔 Token: ' . substr($fcm_token, 0, 20) . '...' : '🔕 No Token';
            
            if ($is_approved) {
                $approval = '✅ Approved';
            } else {
                $approval = '<a class="button" href="?page=pwa-portal&pwa_approve_user=' . $u->ID . '">Approve</a>';
            }
        
            echo '<tr>
                <td>' . esc_html($u->ID) . '</td>
                <td>' . esc_html($u->display_name ?: '-') . '</td>
                <td>' . esc_html($u->user_email) . '</td>
                <td>' . esc_html($work_for ?: '-') . '</td>
                <td>' . ($last ? esc_html(date('Y-m-d H:i', $last)) : '-') . '</td>
                <td>' . $active . '</td>
                <td>' . $fcm_status . '</td>
                <td>' . $approval . '</td>
            </tr>';
        }
        echo '</tbody></table>';

    /* -------------------------------------------------------
     * Send Message Form (Tab: Send)
     * ----------------------------------------------------- */
    echo '</div><div class="pwa-tab-panel" id="pwa-tab-send">';
    echo '<h2 style="margin-top:0">Send Message</h2>';
    echo '<form method="post" style="max-width:700px">';
    wp_nonce_field('pwa_send_message', 'pwa_send_message_nonce');
    echo '
      <label style="display:block;margin:10px 0 6px;font-weight:600">Audience</label>
      <select name="audience" id="audience" onchange="
        document.getElementById(\'aud_single\').style.display = this.value===\'single\'?\'block\':\'none\';
        document.getElementById(\'aud_group\').style.display  = this.value===\'group\'?\'block\':\'none\';
      ">
        <option value="single">Single user</option>
        <option value="group">Group (Who they work for)</option>
        <option value="all">All users</option>
      </select>

      <div id="aud_single" style="margin-top:8px">
        <label>User</label>
        <select name="user_id">
          <option value="">Select user…</option>';
    foreach ($users as $u) {
        echo '<option value="' . esc_attr($u->ID) . '">' . esc_html($u->display_name ?: '-') . ' (#' . $u->ID . ')</option>';
    }
    echo ' </select>
      </div>

      <div id="aud_group" style="margin-top:8px;display:none">
        <label>Who they work for (exact string)</label>
        <input type="text" name="group_key" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px" />
      </div>

      <label style="display:block;margin:10px 0 6px;font-weight:600">Title</label>
      <input type="text" name="title" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px" />

      <label style="display:block;margin:10px 0 6px;font-weight:600">Body</label>
      <textarea name="body" rows="4" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px"></textarea>

      <button class="button button-primary" style="margin-top:12px">Send</button>
    </form>';

    /* -------------------------------------------------------
     * Firebase Replies Viewer (Tab: Replies)
     * ----------------------------------------------------- */
    echo '</div><div class="pwa-tab-panel" id="pwa-tab-replies">';
    echo '<h2 style="margin-top:0">User Replies (Live)</h2>';
    echo '<div id="replies" style="max-width:900px;background:#fff;border:1px solid #eee;padding:16px;border-radius:10px;"></div>';

    echo '<script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
        import { getFirestore, collection, onSnapshot, query, orderBy } 
          from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

        if (!window.pwaFirebase?.db) {
          const cfg = {
            apiKey: "AIzaSyApEX4CvyEPUsqqM8klZ_upOJXN9kgpNlw",
            authDomain: "dowhigh.firebaseapp.com",
            projectId: "dowhigh",
            storageBucket: "dowhigh.firebasestorage.app",
            messagingSenderId: "888938913823",
            appId: "1:888938913823:web:b6aef1c4c028997af6b52a",
          };
          const app = initializeApp(cfg);
          window.pwaFirebase = { db: getFirestore(app) };
        }

        const firebaseDb = window.pwaFirebase?.db;
        const repliesDiv = document.getElementById("replies");

        if (firebaseDb && repliesDiv) {
            const allUsers = ' . json_encode(wp_list_pluck(get_users(['fields' => ['ID', 'display_name']]), 'display_name', 'ID')) . ';
            Object.keys(allUsers).forEach(uid => {
                const q = query(collection(firebaseDb, "notifications", "user_" + uid), orderBy("createdAt", "desc"));
                onSnapshot(q, (snapshot) => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === "added") {
                            const d = change.doc.data();
                            const container = document.createElement("div");
                            container.style.cssText = "border-bottom:1px solid #eee;padding:10px 0";
                            const from = d.from || "user";
                            container.innerHTML = `
                                <strong>${allUsers[uid]}</strong> (#${uid}) <span style="font-size:12px;color:#6b7280">[${from}]</span><br>
                                <span style="color:#374151">${d.message ?? ""}</span>
                                <div style="font-size:12px;color:#9ca3af">${d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : ""}</div>
                            `;
                            repliesDiv.prepend(container);
                        }
                    });
                });
            });
        }
    </script>';

    echo '</div>';
    // Tabs JS
    echo '<script>
      (function(){
        const btns = document.querySelectorAll(".pwa-tab-btn");
        const panels = {
          users: document.getElementById("pwa-tab-users"),
          send: document.getElementById("pwa-tab-send"),
          replies: document.getElementById("pwa-tab-replies"),
        };
        btns.forEach(btn=>btn.addEventListener("click",()=>{
          btns.forEach(b=>b.classList.remove("active"));
          btn.classList.add("active");
          const tab = btn.getAttribute("data-tab");
          Object.values(panels).forEach(p=>p.classList.remove("active"));
          if(panels[tab]) panels[tab].classList.add("active");
        }));
      })();
    </script>';
    echo '</div>';
}


add_action('wp_footer', function(){
  if (!is_user_logged_in()) return;
  ?>
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
    import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } 
      from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyApEX4CvyEPUsqqM8klZ_upOJXN9kgpNlw",
      authDomain: "dowhigh.firebaseapp.com",
      projectId: "dowhigh",
      storageBucket: "dowhigh.firebasestorage.app",
      messagingSenderId: "888938913823",
      appId: "1:888938913823:web:b6aef1c4c028997af6b52a",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    window.pwaFirebase = {db};
  </script>

  <!-- Firebase Cloud Messaging -->
  <script type="module">
    console.log('🚀 Firebase FCM script starting...');
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
    import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging.js";

    // Firebase configuration
    const fcmAppConfig = {
      apiKey: "AIzaSyApEX4CvyEPUsqqM8klZ_upOJXN9kgpNlw",
      authDomain: "dowhigh.firebaseapp.com",
      projectId: "dowhigh",
      storageBucket: "dowhigh.firebasestorage.app",
      messagingSenderId: "888938913823",
      appId: "1:888938913823:web:b6aef1c4c028997af6b52a"
    };

    // Initialize Firebase
    const fcmApp = initializeApp(fcmAppConfig);
    const messaging = getMessaging(fcmApp);

    // Register service worker and then request permission
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
          // Only request permission after service worker is registered
          requestNotificationPermission();
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
          // Still try to request permission even if service worker fails
          requestNotificationPermission();
        });
    } else {
      console.log('❌ Service Worker not supported');
      requestNotificationPermission();
    }

    // Request permission and get token
    async function requestNotificationPermission() {
      console.log('🔔 Requesting notification permission...');
      try {
        const permission = await Notification.requestPermission();
        console.log('🔔 Permission result:', permission);
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          
          // Get FCM token
          const token = await getToken(messaging, {
            vapidKey: 'BM8Kkt9T20WNnrqX3t8h4PB4FLEVie_83Er4xuHOijgypb5w6Nvh0jW69g_Bjs1mKvMbCLRcUitbAPP3tiyP82Q' // Replace with your VAPID key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
          });
          
          if (token) {
            console.log('FCM Token:', token);
            
            // Send token to WordPress with credentials
            try {
              const resp = await fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'same-origin',
                cache: 'no-store',
                body: 'action=pwa_fcm_token&token=' + encodeURIComponent(token)
              });
              const data = await resp.json().catch(()=>({}));
              console.log('Token save response:', resp.status, data);
            } catch (e) {
              console.error('Token save failed:', e);
            }
          } else {
            console.log('No registration token available.');
          }
        } else {
          console.log('Notification permission denied.');
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    }

    // Listen for incoming messages
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      
      // Show notification
      if (payload.notification) {
        const notification = new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/wp-content/uploads/2024/11/fav-icon-pwa.png', // Add your icon
          click_action: payload.data?.click_action || window.location.origin
        });
        
        notification.onclick = function() {
          window.focus();
          notification.close();
        };
      }
    });

    // Permission request is now handled after service worker registration
  </script>
  <?php
});


/* -------------------------------------------------------
 * SHORTCODE: [pwa_messages]
 * ----------------------------------------------------- */
add_shortcode('pwa_messages', function() {
    if (!is_user_logged_in()) {
        return pwa_render_notice('error', 'Please sign in to view your messages.');
    }

    $user_id = get_current_user_id();
    ob_start();
    ?>
    <div id="messages" style="max-width:600px;margin:auto;padding:20px"></div>

    <form id="replyForm" style="max-width:600px;margin:auto;padding:20px">
        <textarea id="replyText" rows="3" placeholder="Write a reply..."
            style="width:100%;padding:10px;border:1px solid #ddd;border-radius:10px;"></textarea>
        <button type="submit"
            style="background:#111827;color:#fff;padding:10px 14px;border-radius:10px;margin-top:10px;cursor:pointer;">
            Send Reply
        </button>
    </form>

    <script type="module">
        import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } 
            from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

        const firebaseDb = window.pwaFirebase.db;
        const userId = "user_<?php echo esc_js($user_id); ?>";
        const box = document.getElementById("messages");
        const replyForm = document.getElementById("replyForm");
        const replyText = document.getElementById("replyText");

        // Listen for incoming notifications
        const messagesRef = collection(firebaseDb, "notifications", userId);
        const q = query(messagesRef, orderBy("createdAt", "desc"));

        onSnapshot(q, (snapshot) => {
            box.innerHTML = '';
            snapshot.forEach((doc) => {
                const d = doc.data();
                const div = document.createElement('div');
                div.style.cssText = "background:#f3f4f6;margin-bottom:10px;padding:12px;border-radius:10px";
                const from = d.from || 'admin';
                const when = d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : '';
                const title = d.title ? `<strong>${d.title}</strong><br>` : '';
                div.innerHTML = `${title}${d.message || ''}<div style=\"font-size:12px;color:#6b7280;margin-top:4px\">From: ${from}${when ? ' • ' + when : ''}</div>`;
                box.appendChild(div);
            });
        });

        // Handle reply form submission
        replyForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = replyText.value.trim();
            if (!text) return;
            const replyRef = collection(firebaseDb, "notifications", userId);
            await addDoc(replyRef, {
                from: "user",
                message: text,
                createdAt: serverTimestamp()
            });
            replyText.value = "";
            alert("✅ Reply sent to admin!");
        });
    </script>
    <?php
    return ob_get_clean();
});



// Handle FCM token registration
add_action('wp_ajax_pwa_fcm_token', function() {
    $current_user_id = get_current_user_id();
    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';

    if ($current_user_id && $token) {
        update_user_meta($current_user_id, '_fcm_token', $token);
        // Optional debug log
        if (defined('WP_CONTENT_DIR')) {
            file_put_contents(WP_CONTENT_DIR . '/pwa_fcm_token.log',
                '['.date('Y-m-d H:i:s')."] Saved token for user #{$current_user_id}: ".substr($token,0,30)."...\n",
                FILE_APPEND
            );
        }
        wp_send_json_success(['message' => 'FCM token updated']);
    }

    wp_send_json_error(['message' => 'Invalid request']);
});

// Function to get Firebase access token using service account
function pwa_get_firebase_access_token($service_account) {
    // Create JWT token for authentication
    $header = json_encode(['typ' => 'JWT', 'alg' => 'RS256']);
    
    $now = time();
    $payload = json_encode([
        'iss' => $service_account['client_email'],
        'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
        'aud' => 'https://oauth2.googleapis.com/token',
        'exp' => $now + 3600,
        'iat' => $now
    ]);
    
    $base64_header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64_payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = '';
    $private_key = $service_account['private_key'];
    
    // Create signature
    openssl_sign($base64_header . '.' . $base64_payload, $signature, $private_key, OPENSSL_ALGO_SHA256);
    $base64_signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    $jwt = $base64_header . '.' . $base64_payload . '.' . $base64_signature;
    
    // Exchange JWT for access token
    $response = wp_remote_post('https://oauth2.googleapis.com/token', [
        'headers' => ['Content-Type' => 'application/x-www-form-urlencoded'],
        'body' => [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt
        ],
        'timeout' => 30
    ]);
    
    if (is_wp_error($response)) {
        return false;
    }
    
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    return $data['access_token'] ?? false;
}

// Never cache /app or /messages pages (works with most cache plugins and hosts)
add_action('template_redirect', function () {
    if (is_page(array('app','messages'))) {
        if (!defined('DONOTCACHEPAGE')) define('DONOTCACHEPAGE', true);
        nocache_headers();
    }
});

// If a wordpress_logged_in_* cookie is present, send no-cache headers (extra safety)
add_action('send_headers', function () {
    foreach ($_COOKIE as $k => $v) {
        if (strpos($k, 'wordpress_logged_in_') === 0) {
            nocache_headers();
            break;
        }
    }
});

