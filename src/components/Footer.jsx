import React from "react";

function Footer() {
  return (
    <div className="text-center text-gray-400 ">
      © {new Date().getFullYear()} NotesHub. All rights reserved
    </div>
  );
}

export default Footer;