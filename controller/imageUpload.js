const multer = require("multer");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    //uploaded files destination
    cb(null, "./client/public/images");
  },
  filename: (req, file, cb) => {

    const newFilename = `${new Date().getDate()}-${new Date().getMonth() +
      1}-${new Date().getFullYear()}-${file.originalname}`;
    cb(null, newFilename);
  }
});

const upload = multer({ storage }).array('files');

const Product = require("../../modules/products");

router.post("/addnew", upload, (req, res) => {
  
     let products = JSON.parse( // Saving products database
       fs.readFileSync(path.join(__dirname, "../../db") + "/products.json")
     );

     const product = new Product(req.body, req.files, uuidv4());   // Creating new Product

     products.unshift(product);    // Adding new product to products array
     products = JSON.stringify(products);     // Updating products database

     fs.writeFileSync(
       path.join(__dirname, "../../db") + "/products.json",
       products
     );

     return res.json(product);
});