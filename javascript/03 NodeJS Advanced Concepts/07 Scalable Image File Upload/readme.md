# 6 Scalable Image File Upload

The best approach to make a Scalable File upload feature on our applications would be using external storage service like amazon, azure or google solutions out there.

this because it is not expensive, it is scalable, automated backup and it is centralized

## 1 Implementations

The implementation of this course had this data flow

- Client app request to API a pre-signed url that allows user to upload a image directly to S3
- API generate from AWS SDK the pre-signed url
- Client upload image file with the pre-signed url
- Client send json data to create blog and linked with the uploaded image
- API Register blog and imageUrl in the mongoDB

### Code to Generate pre-signed URL

//Names of the images has to be unique, so that why key field is appended to userId and a generated uuid as a filename

```
const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const keys = require("../config/keys");

//Initiate a instance of S3 and pass credentials with IAM Service for security
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: "us-east-1",
});


app.get("/api/upload", requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    //Method to get pre-signedUrl
    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "my-blog-ispm",
        ContentType: "image/jpeg",
        Key: key,
      },
      (err, url) => res.send({ key, url })
    );
  });
```

**Once Api client has already uploaded the image**
It send us the post request to create the blog with the url that it has already uploaded to link it with the blogs, here the handler of the API

```
app.post("/api/blogs", requireLogin, cleanCache, async (req, res) => {
    const { title, content, imageUrl } = req.body;

  //Create the document with the imageURl passed from client making reference to the amazon url
    const blog = new Blog({
      imageUrl,
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
```

**It is a good practice to only save the key of the image as we in the future could change from provider to another like Google, Azure, etc**

### AWS Configuration

- Create your S3 Bucket
- Create a IAM Policy to only give permission to your S3 bucket
- Create an IAM user with the policy created the step before
- Configure Cors in S3 to allow your app domain like this:

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "http://localhost:3000"
        ],
        "ExposeHeaders": []
    }
]
```

- Create a bucket policy to allow public to access to object(images) save in your bucket like this:

```
{
    "Version": "2012-10-17",
    "Id": "Policy1648175599246",
    "Statement": [
        {
            "Sid": "Stmt1648175596697",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::my-blog-ispm/*"
        }
    ]
}
```
