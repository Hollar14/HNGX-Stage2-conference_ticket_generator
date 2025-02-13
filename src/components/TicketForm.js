import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  avatar: yup
    .string()
    .test(
      "is-url",
      "Avatar is required",
      (value) => !!value && value.startsWith("http")
    )
    .required("Avatar is required"),

  // avatar: yup.string().url("Invalid image URL").required("Avatar is required"),
});

export default function TicketForm({ onTicketGenerated }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [avatarURL, setAvatarURL] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      avatar: "",
    },
  });

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) {
      setValue("fullName", savedData.fullName);
      setValue("email", savedData.email);
      setValue("avatar", savedData.avatar);
      setAvatarURL(savedData.avatar);
    }
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("formData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", preview);
    formData.append("upload_preset", "avatar"); // Set in Cloudinary

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dwqn2rcuu/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Cloudinary Response:", data); // ✅ Check if Cloudinary receives the file
    if (data.secure_url) {
      setAvatarURL(data.secure_url);
      setValue("avatar", data.secure_url);
      localStorage.setItem(
        "formData",
        JSON.stringify({ ...watch(), avatar: data.secure_url })
      );
    }
    setUploading(false);
  };

  const onSubmit = (data) => {
    localStorage.removeItem("formData");
    onTicketGenerated(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <label>Full Name</label>
      <input {...register("fullName")} placeholder="John Doe" />
      {errors.fullName && <p>{errors.fullName.message}</p>}

      <label>Email</label>
      <input
        type="email"
        {...register("email")}
        placeholder="john@example.com"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <label>Avatar Upload</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" width={100} />}
      <button type="button" onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* {avatarURL && (
        <p>
          Uploaded Image:{" "}
          <a href={avatarURL} target="_blank">
            {avatarURL}
          </a>
        </p>
      )} */}
      {errors.avatar && <p>{errors.avatar.message}</p>}

      <button type="submit">Generate Ticket</button>
    </form>
  );
}
