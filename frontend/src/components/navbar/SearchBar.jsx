import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="search">
      <Search size={18} />
      <input type="text" placeholder="Search..." />
    </div>
  );
}
