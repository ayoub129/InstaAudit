import mongoose from "mongoose"

export interface INewsletterSubscriber {
  _id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

const NewsletterSubscriberSchema = new mongoose.Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
)

NewsletterSubscriberSchema.index({ email: 1 }, { unique: true })

export const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>(
    "NewsletterSubscriber",
    NewsletterSubscriberSchema
  )