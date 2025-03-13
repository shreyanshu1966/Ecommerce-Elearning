import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from '../utils/axiosConfig'; // Replace axios with axiosInstance
import { PlayCircle, Calendar, X, Mail, Phone, User } from "lucide-react";

const SchoolProgramDetail = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWatchModal, setShowWatchModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const { data } = await axiosInstance.get(`/school-programs/${id}`); // Remove /api prefix
        setProgram(data);
      } catch (error) {
        console.error("Error fetching school program:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [id]);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleBookDemoClick = () => {
    setBookingDetails((prev) => ({
      ...prev,
      message: `I am interested in booking a demo for ${program.title}. Please contact me.`,
    }));
    setShowBookModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/demo/book-demo", { ...bookingDetails, programId: id }); // Remove /api prefix
      setBookingStatus("success");
      setTimeout(() => setBookingStatus(""), 3000);
      setBookingDetails({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setBookingStatus("error");
      console.error("Error booking demo:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl inline-block">
          Program not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900">
        <img
          src={program.image}
          alt={program.title}
          className="w-full h-96 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent flex items-end p-8">
          <h1 className="text-4xl font-bold text-white max-w-3xl">{program.title}</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <p className="text-lg text-gray-600 leading-relaxed">{program.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => setShowWatchModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <PlayCircle className="h-5 w-5" />
              Watch Demo
            </button>
            <button
              onClick={handleBookDemoClick}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Calendar className="h-5 w-5" />
              Book Demo
            </button>
          </div>
        </div>

        {/* Program Highlights */}
        {/* <div className="bg-blue-50 rounded-xl p-6 h-fit">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Program Highlights</h3>
          <div className="space-y-3">
            {program.highlights?.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-blue-500 text-white p-1 rounded-full mt-1">
                  <div className="h-4 w-4 flex items-center justify-center">✓</div>
                </div>
                <span className="text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Watch Demo Modal */}
      {/* {showWatchModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{program.title} Demo</h2>
              <button
                onClick={() => setShowWatchModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={getEmbedUrl(program.youtubeLink)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )} */}
      {showWatchModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md relative max-w-2xl w-full">
            <button onClick={() => setShowWatchModal(false)} className="absolute top-2 right-2 text-gray-500 text-2xl">&times;</button>
            <div className="w-full aspect-w-16 aspect-h-9">
              <iframe 
                width="560" 
                height="315" 
                src={getEmbedUrl(program.youtubeLink)} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Book Demo Modal */}
      {showBookModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Schedule a Demo</h2>
              <button
                onClick={() => setShowBookModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              {bookingStatus === "success" && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg">
                  Booking request sent successfully!
                </div>
              )}
              {bookingStatus === "error" && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                  Failed to send request. Please try again.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                  <input
                    type="text"
                    value={program.title}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg border-gray-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </label>
                    <input
                      type="text"
                      value={bookingDetails.name}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={bookingDetails.email}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <input
                    type="number"
                    value={bookingDetails.phone}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={bookingDetails.message}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  Schedule Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolProgramDetail;