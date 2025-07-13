export const uploadAudioToCloudinary = (
  file: File,
  setProgress: (value: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "Gitsync");
    formData.append("resource_type", "video");

    xhr.open("POST", url);

    
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setProgress(percent);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        reject(new Error("Upload failed"));
      }
    };

    xhr.send(formData);
  });
};
