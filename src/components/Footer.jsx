import React from "react";

function Footer() {
  return (
    <div className="footer footer-center p-4 text-base-content ">
      © {new Date().getFullYear()} NotesHub. All rights reserved
    </div>
  );
}

export default Footer;
