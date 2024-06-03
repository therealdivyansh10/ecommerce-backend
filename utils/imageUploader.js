const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file, options);
};

exports.deleteImageFromCloudinary = async (publicId) => {
  try {
    // Delete the image
    const result = await cloudinary.uploader.destroy(publicId);

    console.log(result);
    // Check if deletion was successful
    if (result.result === "ok") {
      console.log("Image deleted successfully");
    } else {
      console.log("Failed to delete image");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
