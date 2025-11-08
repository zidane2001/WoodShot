import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import glob

# Load environment variables
load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

def upload_images_from_directory(directory_path):
    """
    Upload all images from a directory to Cloudinary and return their URLs.

    Args:
        directory_path (str): Path to the directory containing images

    Returns:
        list: List of dictionaries with filename and cloudinary URL for database insertion
    """
    uploaded_images = []

    # Supported image extensions
    image_extensions = ['*.png', '*.jpg', '*.jpeg', '*.gif', '*.bmp', '*.webp']

    # Find all image files in the directory and subdirectories
    image_files = []
    for ext in image_extensions:
        image_files.extend(glob.glob(os.path.join(directory_path, '**', ext), recursive=True))
        image_files.extend(glob.glob(os.path.join(directory_path, '**', ext.upper()), recursive=True))

    print(f"Found {len(image_files)} image files to upload")

    for image_path in image_files:
        try:
            # Get relative path for public_id
            relative_path = os.path.relpath(image_path, directory_path)
            public_id = os.path.splitext(relative_path)[0].replace(os.sep, '/')

            print(f"Uploading {image_path}...")

            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                image_path,
                public_id=public_id,
                folder="woodshot/products",  # Organize in a folder
                overwrite=True,
                resource_type="image"
            )

            # Prepare data for database insertion
            uploaded_images.append({
                'filename': os.path.basename(image_path),
                'relative_path': relative_path,
                'cloudinary_url': upload_result['secure_url'],
                'public_id': upload_result['public_id'],
                'image_url': upload_result['secure_url']  # For direct database insertion
            })

            print(f"✓ Uploaded {relative_path} -> {upload_result['secure_url']}")

        except Exception as e:
            print(f"✗ Failed to upload {image_path}: {str(e)}")
            continue

    return uploaded_images

def get_uploaded_image_urls():
    """
    Function to get uploaded image URLs for database insertion.
    Returns a list of image URLs that can be used to update the database.

    Returns:
        list: List of image URLs for database insertion
    """
    # Path to the photos directory
    photos_dir = "../frontend/public/photos"

    # Convert to absolute path
    photos_dir = os.path.abspath(photos_dir)

    if not os.path.exists(photos_dir):
        print(f"Directory {photos_dir} does not exist!")
        return []

    print(f"Uploading images from: {photos_dir}")

    # Upload images
    uploaded = upload_images_from_directory(photos_dir)

    print(f"\nUpload complete! {len(uploaded)} images uploaded successfully.")

    # Return URLs for database insertion
    image_urls = [img['image_url'] for img in uploaded]

    # Also save to file for reference
    with open('uploaded_image_urls.txt', 'w') as f:
        f.write("# Uploaded Image URLs for Woodshot Products Database\n\n")
        for img in uploaded:
            f.write(f"{img['filename']}: {img['image_url']}\n")

    print(f"\nURLs saved to uploaded_image_urls.txt")
    return image_urls

if __name__ == "__main__":
    # Run the upload process
    urls = get_uploaded_image_urls()

    print(f"\nDatabase-ready URLs ({len(urls)} total):")
    for i, url in enumerate(urls, 1):
        print(f"{i}. {url}")