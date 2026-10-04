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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

        setFormData({
          organizationName: "",
          email: "",
          phone: "",
          location: "",
          website: "",
          organizationType: "",
          description: "",
          areasOfInterest: "",
        });
      } else {
        alert(data.error || "Failed to create profile");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server");
    }
  };

  return (
    <div className="organization-page">
      <div className="organization-card">
        <h1 className="organization-title">
          Create Organization Profile
        </h1>

        <p className="organization-subtitle">
          Tell volunteers about your organization
        </p>

        <form onSubmit={handleSubmit} className="organization-form">

          <div className="organization-group">
            <label htmlFor="organizationName">
              Organization Name
            </label>

            <input
              id="organizationName"
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
              placeholder="Enter organization name"
            />
          </div>

          <div className="organization-row">

            <div className="organization-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="organization@email.com"
              />
            </div>

            <div className="organization-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="08012345678"
              />
            </div>

          </div>

          <div className="organization-row">

            <div className="organization-group">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Abuja, Nigeria"
              />
            </div>

            <div className="organization-group">
              <label htmlFor="website">
                Website
              </label>

              <input
                id="website"
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.org"
              />
            </div>

          </div>

          <div className="organization-group">
            <label htmlFor="organizationType">
              Organization Type
            </label>

            <select
              id="organizationType"
              name="organizationType"
              value={formData.organizationType}
              onChange={handleChange}
              required
            >
              <option value="">
                Select organization type
              </option>

              <option value="NGO">
                NGO
              </option>

              <option value="Non-Profit">
                Non-Profit
              </option>

              <option value="Charity">
                Charity
              </option>

              <option value="Community">
                Community Organization
              </option>

              <option value="Educational">
                Educational Organization
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="organization-group">
            <label htmlFor="areasOfInterest">
              Areas of Interest
            </label>

            <input
              id="areasOfInterest"
              type="text"
              name="areasOfInterest"
              value={formData.areasOfInterest}
              onChange={handleChange}
              placeholder="Education, Health, Environment"
            />
          </div>

          <div className="organization-group">
            <label htmlFor="description">
              About the Organization
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Tell volunteers about your organization..."
            />
          </div>

          <button
            type="submit"
            className="organization-button"
          >
            Create Organization Profile
          </button>

        </form>
      </div>
    </div>
  );
}