import RootLayout from "@/components/shared/rootLayout";

const sampleTopics = [
  {
    id: "1",
    title: "Productivity Mastery",
    description:
      "A comprehensive course on improving productivity through time blocking, note-taking systems, and building effective routines.",
    created: "2023-10-15",
    category:"Security Generated",
    isNew:true
  },
  {
    id: "2",
    title: "Digital Note-Taking Systems",
    description:
      "Learn how to create a comprehensive note-taking system that helps you capture and organize information effectively.",
    
    created: "2023-09-28",
    category:"Security Generated",
  },
  {
    id: "3",
    title: "Building a Second Brain",
    description:
      "Implement a personal knowledge management system to store and retrieve important information and boost your creativity.",
    created: "2023-08-12",
    category:"Security Generated",
  },
];
const Dashboard = () => {
  return (
    <RootLayout>
        {/* Navbar */}
        <nav className="bg-black text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </nav>

      <div className="w-[90%] mx-auto py-6">
        {/* Welcome Section */}
        <section className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm">
          <div className="animate-pulse">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back! <span className="text-2xl">👋</span>
            </h2>
          </div>
          <p className="text-gray-600 mb-6">Get AI generated topics that are not bookish</p>
          
          {/* Stats Cards */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[200px]">
              <h3 className="text-sm text-gray-500">Total Topics</h3>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[200px]">
              <h3 className="text-sm text-gray-500">Script Generated</h3>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[200px]">
              <h3 className="text-sm text-gray-500">Available Credit</h3>
              <p className="text-2xl font-bold text-amber-600">3</p>
            </div>
          </div>
        </section>

        {/* Recently Generated Section */}
        <section className="mb-8 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Generated</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-blue-600">Security Generated</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">New</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Productivity Mastery</h3>
              <p className="text-gray-600 text-sm mb-4">
                A comprehensive course on improving productivity through time blocking, note-taking systems, and building effective routines.
              </p>
              <div className="text-xs text-gray-500">Created: 2023-10-15</div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-purple-600">Script Generated</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Digital Note-Taking Systems</h3>
              <p className="text-gray-600 text-sm mb-4">
                Learn how to create a comprehensive note-taking system that helps you capture and organize information effectively.
              </p>
              <div className="text-xs text-gray-500">Created: 2023-09-28</div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-green-600">Security Generated</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Building a Second Brain</h3>
              <p className="text-gray-600 text-sm mb-4">
                Implement a personal knowledge management system to store and retrieve important information and boost your creativity.
              </p>
              <div className="text-xs text-gray-500">Created: 2023-08-12</div>
            </div>
          </div>
        </section>

        {/* Generate New Content Section */}
       {/* Generate New Content Section */}
<section className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-gray-200">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    Generate New Content
  </h2>
  
  <div className="space-y-5 mb-6">
    {/* Option Cards */}
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Script Generated */}
      <label className="flex-1 cursor-pointer">
        <input 
          type="checkbox" 
          className="hidden peer" 
          checked 
          readOnly
        />
        <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-transparent peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded border border-gray-300 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors">
              <svg className="h-3 w-3 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Script Generated</h3>
              <p className="text-sm text-gray-500">Auto-generate content scripts</p>
            </div>
          </div>
        </div>
      </label>

      {/* Available Credit */}
      <label className="flex-1 cursor-pointer">
        <input 
          type="checkbox" 
          className="hidden peer" 
        />
        <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-transparent peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded border border-gray-300 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors">
              <svg className="h-3 w-3 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Available Credit</h3>
              <p className="text-sm text-gray-500">3 credits remaining</p>
            </div>
          </div>
        </div>
      </label>

      {/* Generate New Topics */}
      <label className="flex-1 cursor-pointer">
        <input 
          type="checkbox" 
          className="hidden peer" 
        />
        <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-transparent peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded border border-gray-300 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors">
              <svg className="h-3 w-3 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Generate New Topics</h3>
              <p className="text-sm text-gray-500">Create fresh content ideas</p>
            </div>
          </div>
        </div>
      </label>
    </div>
  </div>
  
  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-3">
    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Generate Now
    </button>
    <button className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      Show Script
    </button>
  </div>

  {/* Credit Counter */}
  <div className="mt-6 p-3 bg-white rounded-lg shadow-inner border border-gray-200">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">Generation Credits</span>
      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '60%'}}></div>
        </div>
        <span className="text-sm font-bold text-blue-600">3/5</span>
      </div>
    </div>
  </div>
</section>
      </div>
    </RootLayout>
  );
};


export default Dashboard;
