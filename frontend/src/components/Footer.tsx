const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              About
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Supporting UN Sustainable Development Goal 13: Climate Action
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="https://sdgs.un.org/goals/goal13"
                  className="text-base text-gray-500 hover:text-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UN SDG 13
                </a>
              </li>
              <li>
                <a
                  href="https://www.ipcc.ch/"
                  className="text-base text-gray-500 hover:text-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IPCC
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Contact
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Questions? Reach out to us at support@carbontracker.com
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Carbon Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 