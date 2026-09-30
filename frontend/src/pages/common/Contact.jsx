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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-blue-500 font-medium">CONTACT US</p>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold">
            We're Here to Help
          </h1>

          <p className="mt-5 text-slate-400 max-w-2xl mx-auto">
            Have a question about MediCare or our healthcare services? Get in
            touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <MapPin className="text-blue-500" size={25} />

              <h3 className="mt-4 font-semibold">Our Location</h3>

              <p className="mt-2 text-slate-400">
                Bhopal, Madhya Pradesh, India
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Phone className="text-blue-500" size={25} />

              <h3 className="mt-4 font-semibold">Phone</h3>

              <p className="mt-2 text-slate-400">+91 00000 00000</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Mail className="text-blue-500" size={25} />

              <h3 className="mt-4 font-semibold">Email</h3>

              <p className="mt-2 text-slate-400">support@medicare.com</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Clock3 className="text-blue-500" size={25} />

              <h3 className="mt-4 font-semibold">Working Hours</h3>

              <p className="mt-2 text-slate-400">Monday - Saturday</p>

              <p className="text-slate-400">9:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold">Send Us a Message</h2>

            <p className="text-slate-400 mt-2">
              Fill out the form and our team will get back to you.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Write your message..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium transition"
              >
                <Send size={18} />
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
