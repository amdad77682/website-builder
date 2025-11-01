interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-lg">Name</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-semibold">Name</span>
        <button className="border border-gray-300 rounded-full px-4 py-1 flex items-center gap-2">
          Contact
        </button>
      </div>
    </div>
  );
};

export default Header;
