import { Trash, Upload, User } from "lucide-react";
import { useRef, useState } from "react";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setImage(file); // update parent state
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = ""; // reset file input
  };

  const onChooseFile = (e) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* If no image selected */}
      {!image ? (
        <div
          className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-200 cursor-pointer relative"
          onClick={onChooseFile}
        >
          <User className="text-gray-500" size={35} />
          <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
            <Upload size={14} className="text-gray-600" />
          </div>
        </div>
      ) : (
        // If image selected
        <div className="relative w-20 h-20">
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border border-gray-300 shadow"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <Trash size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
