import { Mail, Phone, MapPin, Clock3, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Thank you! Your message has been submitted.");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white selection:bg-cyan-500 selection:text-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-cyan-950/20 via-[#07111f] to-[#07111f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Contact Us
          </span>

          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white">
            We&apos;re Here to Help
          </h1>

          <p className="mt-4 text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Have a question about MediCare or our healthcare services? Get in
            touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Info (Stacked / Grid on smaller screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
            <div className="bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-5 sm:p-6 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                <MapPin className="text-cyan-400" size={20} />
              </div>

              <h3 className="mt-4 font-semibold text-sm sm:text-base text-white">
                Our Location
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-gray-400">
                Bhopal, Madhya Pradesh, India
              </p>
            </div>

            <div className="bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-5 sm:p-6 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                <Phone className="text-cyan-400" size={20} />
              </div>

              <h3 className="mt-4 font-semibold text-sm sm:text-base text-white">
                Phone
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-gray-400">
                +91 00000 00000
              </p>
            </div>

            <div className="bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-5 sm:p-6 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                <Mail className="text-cyan-400" size={20} />
              </div>

              <h3 className="mt-4 font-semibold text-sm sm:text-base text-white">
                Email
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-gray-400">
                support@medicare.com
              </p>
            </div>

            <div className="bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-5 sm:p-6 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                <Clock3 className="text-cyan-400" size={20} />
              </div>

              <h3 className="mt-4 font-semibold text-sm sm:text-base text-white">
                Working Hours
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-gray-400">
                Monday - Saturday
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                9:00 AM - 6:00 PM
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-cyan-500/5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Send Us a Message
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
              Fill out the form and our team will get back to you.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 sm:mt-8 space-y-4 sm:space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-[#07111f] border border-cyan-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/40 transition shadow-lg shadow-cyan-500/5"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-[#07111f] border border-cyan-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/40 transition shadow-lg shadow-cyan-500/5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full bg-[#07111f] border border-cyan-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/40 transition shadow-lg shadow-cyan-500/5 resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-gray-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 text-xs sm:text-sm cursor-pointer"
              >
                <Send size={17} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
