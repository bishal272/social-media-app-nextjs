import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import multiparty from "multiparty";
import { getServerSession } from "next-auth";
import { initMongoose } from "../../../lib/mongoose";
import User from "../../../models/User";
import { authOptions } from "./auth/[...nextauth]";
const bucket = "social-media-app-merkasin";
export default async function handler(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);
  const Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const form = new multiparty.Form({
    uploadDir: "./public",
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      throw err;
    }
    const type = Object.keys(files)[0];
    const fileInfo = files[type][0];
    // console.log(fileInfo);
    const filename = fileInfo.path.split("\\")[1];
    // console.log(filename);
    await Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(fileInfo.path),
        ACL: "public-read",
        Key: filename,
        ContentType: fileInfo.headers["content-type"],
      })
    );
    const coverUrl = `https://${bucket}.s3.amazonaws.com/${filename}`;
    const user = await User.findByIdAndUpdate(session.user.id, {
      [type]: coverUrl,
    });
    fs.unlinkSync(fileInfo.path);
    res.json(coverUrl);
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
