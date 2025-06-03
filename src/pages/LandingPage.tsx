import { Link } from "react-router-dom";
import {
  FiPackage,
  FiMapPin,
  FiClock,
  FiShoppingBag,
  FiFileText,
  FiGift,
  FiArrowRight,
  FiCheck,
  FiStar,
  FiMapPin as FiLocation,
  FiClock as FiTime,
  FiPhone,
} from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import Navbar from "../components/layout/Navbar";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [_isScrolled, setIsScrolled] = useState(false);
  const [activeLocation, setActiveLocation] = useState(0);

  const locations = ["Akure", "Ondo Town", "Owo", "Ikare", "Ore"];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLocation((prev) => (prev + 1) % locations.length);
    }, 3000); // Increased interval for smoother transitions
    return () => clearInterval(interval);
  }, []);

  const scenarios = [
    {
      icon: <FiShoppingBag className="w-8 h-8" />,
      title: "Market Runs & Shopping",
      description:
        "From Balogun Market to Computer Village, we'll handle your shopping needs while you focus on what matters.",
      image: "/market-scenario.jpg", // You'll need to add these images
      stats: "2,500+ successful market runs completed",
    },
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: "Documents & Parcels",
      description:
        "Beat Lagos traffic! Send important documents and packages across the city in record time.",
      image: "/documents-scenario.jpg",
      stats: "10,000+ documents delivered safely",
    },
    {
      icon: <FiGift className="w-8 h-8" />,
      title: "Special Deliveries",
      description:
        "Surprise loved ones with special deliveries - from lunch to gifts, delivered with a personal touch.",
      image: "/special-scenario.jpg",
      stats: "5,000+ moments made special",
    },
  ];

  return (
    <div className="min-h-screen font-georama w-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 overflow-hidden relative bg-gradient-to-b from-gray-50 to-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Interactive Location Banner */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            <div className="relative group min-w-[160px]">
              <div className="absolute inset-0 bg-primary rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative flex items-center justify-center bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all">
                <FiLocation className="text-primary w-5 h-5 mr-2 animate-pulse" />
                <span className="text-sm text-center min-w-[80px] transition-all duration-500">
                  {locations[activeLocation]}
                </span>
              </div>
            </div>
            <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <FiTime className="text-primary w-5 h-5 mr-2" />
              <span className="text-sm group-hover:translate-x-1 transition-transform">
                25-45 mins delivery
              </span>
            </div>
            <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <FiPhone className="text-primary w-5 h-5 mr-2" />
              <span className="text-sm">Call Us Now</span>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block animate-bounce mb-4">
              <RiMotorbikeFill className="text-primary w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-secondary leading-tight animate-slideUp">
              Need Something Delivered?
              <span className="text-primary block mt-2">
                We Dey Here For You!
              </span>
            </h1>
            <p className="text-gray-medium text-lg lg:text-xl mt-6 mb-8 animate-slideUp delay-100 max-w-2xl mx-auto">
              From Alagbaka to Oja Oba, FUTA to Shasha Market - we go deliver
              your package sharp sharp! No stress, just relax.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp delay-200">
              <Link to="/signup" className="btn-primary min-w-[200px] group">
                Start Now
                <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/become-rider"
                className="btn-outline min-w-[200px] group"
              >
                Become A Rider
                <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer animate-slideUp"
              style={{ animationDelay: "300ms" }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <FiClock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Quick Delivery</h3>
              <p className="text-gray-medium text-sm">
                We dey move sharp sharp! From Akure to Owo, we got you covered.
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer animate-slideUp"
              style={{ animationDelay: "400ms" }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Everywhere For Town</h3>
              <p className="text-gray-medium text-sm">
                Anywhere for Ondo State, we go reach there!
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer animate-slideUp"
              style={{ animationDelay: "500ms" }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <FiCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-medium text-sm">
                100% safe delivery, no wahala!
              </p>
            </div>
          </div>
        </div>

        {/* Floating Trust Indicators */}
        <div className="absolute bottom-4 left-4 animate-float delay-100">
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs">Riders Online</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 animate-float delay-200">
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <FiStar className="text-yellow-500 w-4 h-4" />
              <span className="text-xs">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Scenarios Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-6 animate-fadeIn">
            How Can We Help You Today?
          </h2>
          <p className="text-gray-medium text-center text-lg mb-16 max-w-2xl mx-auto animate-fadeIn delay-100">
            Select a scenario to see how Peekop makes your life easier
          </p>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {scenarios.map((scenario, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all transform hover:scale-102 ${
                    activeScenario === index
                      ? "bg-primary text-white shadow-lg scale-102"
                      : "bg-white border border-gray-100 hover:border-primary/20"
                  }`}
                  onClick={() => setActiveScenario(index)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-full p-3 ${
                        activeScenario === index
                          ? "bg-white/10"
                          : "bg-primary/10"
                      }`}
                    >
                      {scenario.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {scenario.title}
                      </h3>
                      <p
                        className={
                          activeScenario === index
                            ? "text-white/90"
                            : "text-gray-medium"
                        }
                      >
                        {scenario.description}
                      </p>
                      <p className="mt-2 font-medium">{scenario.stats}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative h-[500px] bg-gray-light rounded-2xl overflow-hidden animate-float">
              {/* Replace with actual scenario images */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 animate-fadeIn">
            Why Lagos Trusts Peekop
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FiPackage className="w-8 h-8" />}
              title="Secure & Reliable"
              description="Your items are handled with utmost care and professionalism. Real-time tracking for peace of mind."
              delay={0}
            />
            <FeatureCard
              icon={<FiMapPin className="w-8 h-8" />}
              title="Local Excellence"
              description="Our riders know every street and shortcut in Lagos. Fast delivery, even during rush hour."
              delay={100}
            />
            <FeatureCard
              icon={<FiClock className="w-8 h-8" />}
              title="Lightning Fast"
              description="Experience swift pickups and deliveries that will exceed your expectations."
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fadeIn">
            Ready to Experience Better Deliveries?
          </h2>
          <p className="text-gray-medium text-lg mb-8 max-w-2xl mx-auto animate-fadeIn delay-100">
            Join thousands of satisfied customers who rely on Peekop for their
            daily delivery needs. Start your journey today!
          </p>
          <Link
            to="/signup"
            className="btn-primary inline-flex items-center group animate-fadeIn delay-200"
          >
            Start Your Free Account
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="mt-12 flex flex-wrap justify-center gap-8 animate-fadeIn delay-300">
            <TestimonialBadge
              name="Sarah O."
              role="Business Owner"
              quote="Peekop has transformed how I handle deliveries!"
            />
            <TestimonialBadge
              name="Michael A."
              role="Office Manager"
              quote="Fast, reliable, and professional service."
            />
            <TestimonialBadge
              name="Chioma E."
              role="Regular User"
              quote="The best delivery service in Lagos!"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) => {
  return (
    <div
      className={`p-6 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all animate-slideUp`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-medium">{description}</p>
    </div>
  );
};

const TestimonialBadge = ({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm max-w-xs">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {name[0]}
      </div>
      <div className="text-left">
        <p className="text-sm font-medium">{quote}</p>
        <p className="text-xs text-gray-medium mt-1">
          {name} - {role}
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
