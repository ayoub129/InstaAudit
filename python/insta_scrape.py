import sys
import json
import instaloader

def main(username):
    L = instaloader.Instaloader()
    L.load_session_from_file('ayoubberouijil')
    profile = instaloader.Profile.from_username(L.context, username)
    data = {
        "username": profile.username,
        "bio": profile.biography,
        "profile_pic_url": profile.profile_pic_url,
        "posts": []
    }
    for post in profile.get_posts():
        post_data = {
            "type": "video" if post.is_video else "image",
            "caption": post.caption,
            "url": post.url,
            "thumbnail_url": post.video_thumbnail_url if post.is_video else post.url,
            "likes": post.likes,
            "comments": post.comments,
            "is_video": post.is_video
        }
        data["posts"].append(post_data)
        if len(data["posts"]) >= 5:  # Limit to last 5 posts for demo
            break
    print(json.dumps(data))

if __name__ == "__main__":
    username = sys.argv[1]
    main(username)