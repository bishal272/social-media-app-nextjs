import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import fs from "fs";
import multiparty from "multiparty";
const bucket = "social-media-app-merkasin";
export default async function handler(req, res) {
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
    const fileInfo = files["cover"][0];
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
    res.json(`https://${bucket}.s3.amazonaws.com/${filename}`);
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
