import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bgImage from '@/assets/background.png';

const HomePage = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Slide data for carousel
  const slides = [
    {
      title: "About Us",
      content: "We provide a comprehensive student management solution designed to help educational institutions streamline their administrative processes and enhance student learning experiences.",
      icon: "👨‍🎓"
    },
    {
      title: "Latest News",
      content: "Our platform now supports real-time analytics and reporting. Track student performance metrics and generate insightful reports with just a few clicks.",
      icon: "📰"
    },
    {
      title: "Upcoming Events",
      content: "Join our webinar on 'Effective Student Assessment Techniques' on April 15, 2025. Register through your dashboard to secure your spot.",
      icon: "🗓️"
    }
  ];

  // Key highlights data
  const highlights = [
    { title: "Easy Enrollment", description: "Streamlined admission process with digital documentation", icon: "✅" },
    { title: "Performance Tracking", description: "Real-time analytics to monitor student progress", icon: "📊" },
    { title: "Communication Tools", description: "Direct messaging between students, parents, and faculty", icon: "💬" },
    { title: "Resource Library", description: "Access to educational materials and resources", icon: "📚" }
  ];

  // Student feedback data
  const feedback = [
    { name: "Alex Johnson", role: "Computer Science Student", comment: "This platform has transformed how I track my assignments and grades. The interface is intuitive and user-friendly.", avatar: "A" },
    { name: "Maria Garcia", role: "Engineering Student", comment: "I love how easy it is to communicate with professors and submit assignments through the portal.", avatar: "M" },
    { name: "David Chen", role: "Business Major", comment: "The calendar integration and event notifications have helped me stay organized throughout the semester.", avatar: "D" }
  ];

  // Handle carousel navigation
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div
        className="relative flex items-center justify-center min-h-[500px] p-8 bg-gray-200 bg-opacity-90"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto text-center z-10">
          <h1 className="text-5xl font-bold text-blue-800 mb-6 mt-0 md:mt-40">
            Student Management System
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Empowering educational institutions with comprehensive tools to manage students,
            track performance, and streamline academic processes.
          </p>
          <div className='flex-column w-50 m-auto'>
            <Link to="/login">
              <button className="w-50  mb-5 px-8 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer">
                Login
              </button>
            </Link>
            <Link to="/register-admin">
              <button className="w-50 px-8 py-3 bg-red-200 hover:bg-red-400 text-black font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer">
                SignUp
              </button>
            </Link>
          </div>
          <p className="text-m text-red-700 mb-8 max-w-2xl mx-auto">
            * Sign up facility is provided to you only for signing up as an admin
          </p>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Stay Informed
          </h2>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                {slides.map((slide, index) => (
                  <div key={index} className="min-w-full px-4">
                    <div className="bg-blue-50 rounded-lg p-8 shadow-md text-center">
                      <div className="text-4xl mb-4">{slide.icon}</div>
                      <h3 className="text-2xl font-semibold text-blue-700 mb-3">{slide.title}</h3>
                      <p className="text-gray-600">{slide.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              ←
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              →
            </button>

            <div className="flex justify-center mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-3 w-3 mx-1 rounded-full ${activeSlide === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Highlights Grid */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
            Key Highlights
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Our platform offers powerful features designed to enhance educational management
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
                <div className="text-3xl text-blue-600 mb-4">{highlight.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Feedback Section */}
      <div className="py-12 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
            What Our Students Say
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Hear from students who have experienced the benefits of our platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedback.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-xl">
                    {item.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{item.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2025 Student Management System. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-blue-300 hover:text-blue-100 mx-2">Privacy Policy</a>
            <a href="#" className="text-blue-300 hover:text-blue-100 mx-2">Terms of Service</a>
            <a href="#" className="text-blue-300 hover:text-blue-100 mx-2">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;




// import { Button } from '@/components/ui/button';
{/* <div className="flex space-x-4">
        <Link to="/login">
          <Button variant="outline" className="px-6 py-3">
            Login
          </Button>
        </Link>
        <Link to="/signup">
          <Button className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700">
            Sign Up
          </Button>
        </Link>
      </div> */}