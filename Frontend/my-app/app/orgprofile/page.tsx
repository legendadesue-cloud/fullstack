"use client";

import { useState } from "react";

export default function OrganizationProfile() {
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    organizationType: "",
    description: "",
    areasOfInterest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organization/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Organization profile created successfully!");
      } else {
        alert(data.error || "Failed to create profile");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#0c8b55] text-center">
          Create Organization Profile
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Tell volunteers about your organization
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-2">
              Organization Name
            </label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0c8b55]"
              placeholder="Enter organization name"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0c8b55]"
                placeholder="organization@email.com"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0c8b55]"
                placeholder="08012345678"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0c8b55]"
                placeholder="Abuja, Nigeria"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0c8b55]"
                placeholder="https://example.org"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Organization Type
            </label>

            <select
              name="organizationType"
              value={formData.organizationType}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-[#0c8b55]"
            >
              <option value="">Select organization type</option>
              <option value="NGO">NGO</option>
              <option value="Non-Profit">Non-Profit</option>
              <option value="Charity">Charity</option>
              <option value="Community">Community Organization</option>
              <option value="Educational">Educational Organization</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Areas of Interest
            </label>

            <input
              type="text"
              name="areasOfInterest"
              value={formData.areasOfInterest}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0c8b55]"
              placeholder="Education, Health, Environment"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              About the Organization
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0c8b55]"
              placeholder="Tell volunteers about your organization..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0c8b55] hover:bg-[#087147] text-white font-semibold py-3 rounded-lg transition"
          >
            Create Organization Profile
          </button>
        </form>
      </div>
    </div>
  );
}