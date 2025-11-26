// src/pages/DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import HomeSection from "@/components/HomeSection/HomeSection";
import { supabase } from "@/lib/supabaseClient";
import MapDashboard from "@/components/Map/MapDashboard";

const DashboardLayout = () => {
  const [section, setSection] = useState("Home");
  const [hover, setHover] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Logout effettuato!");
  };

  return (
    <div className="flex w-full h-screen">
      <Sidebar section={section} setSection={setSection} hover={hover} setHover={setHover} onLogout={handleLogout} />

      <div className="flex-1 overflow-auto ml-20 md:ml-72 p-4">
        {section === "Home" && <HomeSection user={{ id: "me", user_metadata: {} }} />}

        {section === "Mappa" && <MapDashboard profile={{ role: "artist" }} />}

        {section === "Opportunità" && <div>Sezione Opportunità</div>}
        {section === "Community" && <div>Sezione Community</div>}
        {section === "Inbox" && <div>Sezione Inbox</div>}
        {section === "Profilo" && <div>Sezione Profilo</div>}
        {section === "Info" && <div>Sezione Info</div>}
      </div>
    </div>
  );
};

export default DashboardLayout;


