import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-[90vh] bg-white dark:bg-[#0b141a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>

        <div className="container mx-auto max-w-6xl text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
            Welcome to the Safe Space
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
            Nurturing Minds, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-gradient">Empowering Souls.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Join a community of 5,000+ individuals sharing experiences, finding support, and growing together in a judgment-free environment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-1">
              Start Your Journey
            </Link>
            <Link to="/articles" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              Explore Stories
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-100 dark:border-gray-800 pt-12">
            <div>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">1.2k+</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">Stories</div>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400">85+</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">Groups</div>
            </div>
            <div>
              <div className="text-3xl font-black text-teal-600 dark:text-teal-400">24/7</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">Support</div>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-600 dark:text-orange-400">100%</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">Private</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-24 px-4 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How We Support You</h2>
            <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v6h6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13h10M7 17h10" /></svg>}
              title="Shared Experiences"
              desc="Read and write articles about mental health journeys, tips, and personal victories."
              color="indigo"
            />
            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              title="Support Groups"
              desc="Join moderated communities focused on specific challenges to find your tribe."
              color="purple"
            />
            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              title="Safe & Private"
              desc="Your privacy is our priority. Share anonymously or with a pseudonym in our protected space."
              color="teal"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  const colors = {
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400"
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all group">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}
