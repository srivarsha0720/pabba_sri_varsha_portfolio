import { useState, useEffect } from 'react';
import { Menu, X, ArrowDown, Github, Linkedin, Mail, ChevronUp, ExternalLink } from 'lucide-react';
import emailjs from "@emailjs/browser";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
 const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
 const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const fullText = "Full Stack Developer | Building Scalable Web Apps | Tech Enthusiast";
  
  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let isPaused = false;
    let pauseCounter = 0;
    
    const timer = setInterval(() => {
      if (isPaused) {
        pauseCounter++;
        if (pauseCounter >= (isDeleting ? 20 : 40)) { // Pause longer after typing, shorter after deleting
          isPaused = false;
          pauseCounter = 0;
        }
        return;
      }

      if (!isDeleting) {
        // Typing forward
        if (index <= fullText.length) {
          setTypedText(fullText.slice(0, index));
          index++;
        } else {
          // Finished typing, pause before deleting
          isPaused = true;
          isDeleting = true;
        }
      } else {
        // Deleting backward
        if (index > 0) {
          index--;
          setTypedText(fullText.slice(0, index));
        } else {
          // Finished deleting, pause before typing again
          isPaused = true;
          isDeleting = false;
        }
      }
    }, isDeleting ? 30 : 50); // Faster deletion, slower typing
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      setScrollProgress(progress);

      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const errors: { [key: string]: string } = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.message.trim()) {
    errors.message = "Message is required";
  }

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setFormErrors({});

  emailjs
    .send(
      "service_fwbit2q",
      "template_qzrtew5",
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      },
      "DzWATDEwljyCm3ACh"
    )
    .then(() => {
      setFormSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
    });
};

  



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-indigo-100/30 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-indigo-100/30 to-blue-100/30 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200/50 dark:bg-slate-800/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 transition-all duration-300 animate-shimmer"
          style={{ 
            width: `${scrollProgress}%`,
            backgroundSize: '200% 100%'
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            SV
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['home', 'about', 'skills', 'projects', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`relative text-sm font-semibold transition-all duration-300 ${
                  activeSection === item 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                {activeSection === item && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 space-y-4">
              {['home', 'about', 'skills', 'projects', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-indigo-50/20 to-blue-50/40 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-blue-950/20" />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-6 opacity-0 animate-fade-in">
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3 tracking-wide">Hello, I'm</p>
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Sri Varsha Pabba
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-10 h-8 opacity-0 animate-fade-in-delay font-medium">
            {typedText}<span className="animate-blink">|</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-delay-2">
            <a
              href="https://drive.google.com/file/d/18VY56gsyEXWtXYM1LAUa-OqQo9_ie-6I/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Resume</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="group relative px-8 py-4 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Contact Me</span>
              <span className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="text-blue-400 dark:text-blue-600" size={32} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            About Me
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500" style={{ animationDelay: '1s' }} />
                <img
                  src="https://019c5ee8-1bd7-7cd5-ba9a-97eb40f5d2b5.mochausercontent.com/myimage1.jpeg"
                  alt="Sri Varsha Pabba"
                  className="relative w-72 h-72 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-2xl ring-4 ring-blue-100 dark:ring-blue-900/30 group-hover:ring-blue-200 dark:group-hover:ring-blue-800/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Hi, I'm Sri Varsha Pabba, a passionate and detail-oriented Full Stack Web Developer. 
                I specialize in building responsive, user-friendly web applications that solve real-world problems.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                With hands-on experience in HTML, CSS, JavaScript, React.js, Node.js, Express.js, and RESTful APIs, 
                I enjoy transforming ideas into functional and scalable digital solutions. I'm a quick learner who adapts 
                to new technologies and continuously improves my skills to stay updated in the ever-evolving tech world.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="px-5 py-2.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Problem Solver
                </span>
                <span className="px-5 py-2.5 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Fast Learner
                </span>
                <span className="px-5 py-2.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Scalable Solutions
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-gradient-to-b from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-900/50 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
             Skills
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Frontend */}
            <div className="card-hover group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-blue-100 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">F</span>
                </div>
                <h3 className="text-2xl font-bold mb-5 text-blue-600 dark:text-blue-400">Frontend</h3>
                <div className="space-y-3">
                  {['HTML5', 'CSS3', 'JavaScript', 'React.js'].map((skill) => (
                    <div key={skill} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Backend */}
            <div className="card-hover group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-indigo-100 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">B</span>
                </div>
                <h3 className="text-2xl font-bold mb-5 text-indigo-600 dark:text-indigo-400">Backend</h3>
                <div className="space-y-3">
                  {['Node.js', 'Express.js', 'REST APIs'].map((skill) => (
                    <div key={skill} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Database */}
            <div className="card-hover group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-blue-100 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">D</span>
                </div>
                <h3 className="text-2xl font-bold mb-5 text-blue-600 dark:text-blue-400">Database</h3>
                <div className="space-y-3">
                  {['Firebase', 'Supabase'].map((skill) => (
                    <div key={skill} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="card-hover group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-indigo-100 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">T</span>
                </div>
                <h3 className="text-2xl font-bold mb-5 text-indigo-600 dark:text-indigo-400">Tools</h3>
                <div className="space-y-3">
                  {['Git', 'GitHub', 'VS Code', 'Postman'].map((skill) => (
                    <div key={skill} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Soft Skills */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-slate-100">Soft Skills</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['Leadership', 'Time Management', 'Teamwork'].map((skill) => (
                <span
                  key={skill}
                  className="px-8 py-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-slate-800 dark:text-slate-200 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-200 dark:border-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
             Projects
          </h2>

          <div className="max-w-3xl mx-auto">
            <div 
              className="card-hover group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-blue-100 dark:border-slate-700 cursor-pointer relative"
              onClick={() => setShowModal(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="aspect-video overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <img 
                  src="https://images.moneycontrol.com/static-mcnews/2017/08/crowdfunding.jpg?impolicy=website&width=1600&height=900"
                  alt="FundSpark - Crowdfunding Platform "
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-8 relative">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  FundSpark - Crowdfunding Platform
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Developed a full-stack crowdfunding application enabling users to create campaigns, set funding goals, rewards, and milestones.
                  Designed and integrated secure authentication and dynamic project management features to handle user contributions and funding progress visualization.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {['React.js', 'Node.js', 'Express.js', 'JavaScript','Supabase','HTML5', 'Tailwind CSS', ].map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold border border-blue-200 dark:border-blue-800"
                    >
                      {tech}
                    </span>
                  ))}
                  
                </div>

                <div className="flex gap-4">
                  <a
                    href="https://github.com/srivarsha0720/fundspark-frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Github size={20} />
                    View Code
                  </a>
                  <a
                    href="https://fundspark-crowd.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <ExternalLink size={20} />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-b from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-900/50 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Get In Touch
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-blue-100 dark:border-slate-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500"
    placeholder="Your name"
    required  />
    {formErrors.email && (
  <p className="mt-1 text-sm text-red-600">
    {formErrors.name}
  </p>
)}
                   
                
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                  
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500"
    placeholder="your.email@example.com"
    required/>
    {formErrors.email && (
  <p className="mt-1 text-sm text-red-600">
    {formErrors.email}
  </p>
)}
                  
                 
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                  name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-blue-600 dark:focus:border-blue-400 transition-all resize-none text-slate-900 dark:text-slate-100"
                    placeholder="Your message..."/>
                    {formErrors.message && (
  <p className="mt-1 text-sm text-red-600">
    {formErrors.message}
  </p>
)}
                  
                  
                  
                </div>

                <button
                  type="submit"
                  className="w-full relative px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10">Send Message</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </form>

              {formSubmitted && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-xl animate-fade-in border border-green-200 dark:border-green-800 font-medium">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-blue-100 dark:border-slate-700">
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">varshapabba23@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      📱
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">6309927830</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      📍
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Hyderabad</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                  Connect With Me
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/srivarsha0720"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-4 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    <Github size={28} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/pabba-sri-varsha-6563623b1?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    <Linkedin size={28} />
                  </a>
                  <a
                    href="mailto:varshapabba23@gmail.com"
                    className="flex-1 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    <Mail size={28} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-blue-100 dark:border-slate-800 bg-gradient-to-b from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            © 2024 Sri Varsha Pabba. Built with passion and code.
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {scrollProgress > 20 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300 z-30 group"
        >
          <ChevronUp size={24} className="group-hover:animate-bounce" />
        </button>
      )}

      {/* Project Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full p-8 shadow-2xl animate-fade-in border border-blue-100 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Time Tracker and Analytics Dashboard
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X size={24} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="space-y-5 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                A comprehensive web-based application designed to help users track their daily activities and visualize 
                productivity patterns through interactive analytics.
              </p>
              
              <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-6">Key Features:</h4>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Live Timer:</strong> Real-time activity tracking with start/stop functionality</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Activity Management:</strong> Create, edit, and organize activities with custom categories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Data Visualization:</strong> Interactive timeline, pie charts, and bar graphs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Analytics Dashboard:</strong> Comprehensive overview of time distribution</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Responsive Design:</strong> Seamless experience across all devices</span>
                </li>
              </ul>

              <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-6">Technical Implementation:</h4>
              <p className="leading-relaxed">
                Built using React.js for the frontend with a Node.js/Express.js backend. The application uses 
                RESTful APIs for data management and features real-time updates using modern JavaScript patterns.
              </p>

              <div className="flex gap-4 mt-8">
                <a
                  href="https://github.com/srivarsha0720/Time-Tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Github size={20} />
                  View Code
                </a>
                <a
                  href="https://2wkzldu2bjztc.mocha.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <ExternalLink size={20} />
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};