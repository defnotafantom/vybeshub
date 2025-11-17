import React, { useState, useEffect, useRef } from "react";
import EditProfileModal from "@/components/EditProfileModal";
import { useDebounce } from "use-debounce";

const emojis = ["😀","😂","😍","🥳","🤯"];
const userArtTags = ["Digital","Painting","Sculpture","Photography","Mixed"];

export default function ProfileSection({ profile, setEditOpen, uploadFile, onFollow, isMyProfile }) {
  if (!profile) return null;

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("vibes");
  const [vibes, setVibes] = useState(profile.posts?.filter(p => !p.image_url) || []);
  const [artworks, setArtworks] = useState(profile.posts?.filter(p => p.image_url) || []);

  // --- Popup Nuova Vibe ---
  const [isPostPopupOpen, setIsPostPopupOpen] = useState(false);
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [location, setLocation] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [responseOption, setResponseOption] = useState("");
  const [approveResponses, setApproveResponses] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [debouncedQuery] = useDebounce(mentionQuery, 300);
  const [mentionPosition, setMentionPosition] = useState("bottom");
  const [emojiPosition, setEmojiPosition] = useState("bottom");

  const popupRef = useRef(null);
  const emojiRef = useRef(null);
  const maxChars = 280;

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    if (onFollow) onFollow(!isFollowing);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 2) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePublish = () => {
    if (!text.trim() && !file) return;
    const newPost = { id: Date.now(), text, tags: selectedTags, file, location, responseOption, approveResponses };
    if (file) setArtworks(prev => [newPost, ...prev]);
    else setVibes(prev => [newPost, ...prev]);
    setText(""); setSelectedTags([]); setFile(null); setLocation(""); setOptionsOpen(false);
    setApproveResponses(false); setResponseOption(""); setIsPostPopupOpen(false); setMentionQuery(""); setMentionSuggestions([]);
  };

  // --- Fetch utenti per menzioni dinamiche ---
  useEffect(() => {
    if (!debouncedQuery) {
      setMentionSuggestions([]);
      return;
    }
    fetch(`/api/users?search=${debouncedQuery}`)
      .then(res => res.json())
      .then(data => setMentionSuggestions(data))
      .catch(() => setMentionSuggestions([]));
  }, [debouncedQuery]);

  // --- Chiudi emoji e menzioni cliccando fuori ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmojiPicker(false);
      if (popupRef.current && !popupRef.current.contains(e.target)) setMentionSuggestions([]);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Posizionamento dinamico emoji e menzioni ---
  useEffect(() => {
    if (!isPostPopupOpen) return;
    const handleResizeOrScroll = () => {
      if (!popupRef.current) return;
      const rect = popupRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setMentionPosition(spaceBelow < 200 ? "top" : "bottom");
      setEmojiPosition(spaceBelow < 150 ? "top" : "bottom");
    };
    handleResizeOrScroll();
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);
    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [isPostPopupOpen]);

  const renderUsernameWithTags = () => selectedTags.length === 0 ? profile.username : `${profile.username} > ${selectedTags.join(" - ")}`;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl p-4">
        <div className="bg-white dark:bg-black rounded-3xl shadow-xl p-6 flex flex-col gap-6 border border-neutral-200 dark:border-neutral-800">

          {/* Avatar + Info */}
          <div className="flex flex-col items-center gap-4 text-center">
            <img src={profile.avatar_url || "https://i.imgur.com/placeholder.png"} alt="Avatar"
              className="w-28 h-28 rounded-full border object-cover shadow-md"/>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight">{profile.username || "Artista"}</h1>
              <p className="text-neutral-500 dark:text-neutral-400">{profile.art_type}</p>
              <p className="text-neutral-700 dark:text-neutral-300 max-w-md mx-auto">{profile.bio}</p>
            </div>

            {/* Pulsanti */}
            <div className="flex gap-3 mt-2">
              <button className="bg-black text-white px-5 py-2 rounded-full dark:bg-white dark:text-black shadow hover:opacity-90 transition"
                onClick={() => setEditOpen(true)}>Modifica Profilo</button>
              {!isMyProfile && (
                <button onClick={toggleFollow} className="bg-neutral-200 dark:bg-neutral-800 px-5 py-2 rounded-full hover:opacity-80 transition">
                  {isFollowing ? "Non seguire" : "Segui"}
                </button>
              )}
            </div>

            {isMyProfile && (
              <button onClick={() => setIsPostPopupOpen(true)}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                Crea una nuova Vibe
              </button>
            )}
          </div>

          {/* --- Popup Nuova Vibe --- */}
          {isPostPopupOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
              <div ref={popupRef} className="bg-white dark:bg-black w-full max-w-md rounded-3xl shadow-xl flex flex-col overflow-hidden relative">

                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-2">
                  <button onClick={() => setIsPostPopupOpen(false)} className="text-gray-500 font-semibold">Annulla</button>
                  <span className="font-bold text-lg">Nuova Vibe</span>
                  <div/>
                </div>
                <div className="border-b border-neutral-300 dark:border-neutral-700" />

                {/* BODY */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img src={profile.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover"/>
                    <span className="font-semibold">{renderUsernameWithTags()}</span>
                  </div>

                  {/* Art-tags sotto avatar */}
                  <select value="" onChange={(e) => { toggleTag(e.target.value); e.target.value=""; }}
                    className="ml-1 p-1 border rounded text-sm">
                    <option value="">Seleziona Art-Tag</option>
                    {userArtTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>

                  {/* Input testo con menzioni */}
                  <textarea placeholder="Cosa vuoi trasmettere?" value={text}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= maxChars) {
                        setText(val);
                        const words = val.split(" ");
                        const lastWord = words[words.length - 1];
                        if (lastWord.startsWith("@")) setMentionQuery(lastWord.slice(1));
                        else setMentionQuery("");
                      }
                    }}
                    className="w-full p-2 border rounded-lg resize-none" rows={1}
                  />

                  {/* Dropdown menzioni */}
                  {mentionSuggestions.length > 0 && (
                    <div className={`absolute ${mentionPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"} left-0 bg-white dark:bg-black border rounded shadow z-10 w-full`}>
                      {mentionSuggestions.map(u => (
                        <button key={u.id} className="block w-full text-left px-2 py-1 hover:bg-gray-200 dark:hover:bg-neutral-700"
                          onClick={() => {
                            const words = text.split(" ");
                            words.pop();
                            setText([...words, "@" + u.display].join(" ") + " ");
                            setMentionQuery("");
                          }}>{u.display}</button>
                      ))}
                    </div>
                  )}

                  {/* Barra icone */}
                  <div className="flex items-center gap-4 mt-2">
                    <label className="cursor-pointer">
                      📁<input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                    </label>
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
                    <button>📍</button>
                    <button>@</button>

                    {showEmojiPicker && (
                      <div ref={emojiRef} className={`absolute ${emojiPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"} left-0 bg-white dark:bg-black border p-2 rounded shadow flex flex-wrap gap-1 z-10`}>
                        {emojis.map(e => <button key={e} onClick={() => setText(text+e)}>{e}</button>)}
                      </div>
                    )}
                  </div>

                  {/* Anteprima file */}
                  {file && (
                    <div className="mt-2 border rounded p-2">
                      {file.type.startsWith("image") ? (
                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full rounded"/>
                      ) : (
                        <video src={URL.createObjectURL(file)} controls className="w-full rounded"/>
                      )}
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-300 dark:border-neutral-700">
                  <div className="relative">
                    <button onClick={() => setOptionsOpen(!optionsOpen)} className="flex items-center gap-1 text-sm">⚙️ Opzioni risposta</button>
                    {optionsOpen && (
                      <div className="absolute bottom-full left-0 bg-white dark:bg-black p-3 border rounded shadow w-64 mt-1 z-10 flex flex-col gap-2">
                        <div className="font-semibold mb-1">Chi può rispondere e aggiungere menzioni</div>
                        <div className="flex flex-col gap-1">
                          {["Followers","Persone che segui","Persone che menzioni"].map(opt => (
                            <label key={opt} className="flex items-center gap-2">
                              <input type="radio" name="responseOption" checked={responseOption === opt} onChange={() => setResponseOption(opt)}/>
                              {opt}
                            </label>
                          ))}
                        </div>
                        <div className="border-t border-neutral-300 dark:border-neutral-700 mt-2 pt-1 flex items-center justify-between">
                          <span className="text-sm">Controlla e approva risposte</span>
                          <input type="checkbox" checked={approveResponses} onChange={() => setApproveResponses(!approveResponses)}/>
                        </div>
                      </div>
                    )}
                  </div>

                  <button onClick={handlePublish} className="bg-blue-500 text-white px-4 py-1 rounded-xl"
                    disabled={!text.trim() && !file}>Pubblica</button>
                </div>
              </div>
            </div>
          )}

          {/* --- Sezioni Vibes / Arte --- */}
          <div className="w-full flex justify-center mt-8 border-b border-neutral-300 dark:border-neutral-700">
            <button onClick={() => setActiveTab("vibes")}
              className={`px-6 py-3 font-semibold transition relative ${activeTab === "vibes" ? "text-black dark:text-white" : "text-neutral-500"}`}>
              Vibes
              {activeTab === "vibes" && <div className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-black dark:bg-white rounded-full"></div>}
            </button>
            <button onClick={() => setActiveTab("arte")}
              className={`px-6 py-3 font-semibold transition relative ${activeTab === "arte" ? "text-black dark:text-white" : "text-neutral-500"}`}>
              La mia arte
              {activeTab === "arte" && <div className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-black dark:bg-white rounded-full"></div>}
            </button>
          </div>

          {activeTab === "vibes" && (
            <div className="flex flex-col gap-4 mt-6">
              {vibes.length > 0 ? vibes.map(post => (
                <div key={post.id} className="p-4 rounded-2xl border shadow bg-white dark:bg-neutral-900">
                  <p className="text-neutral-800 dark:text-neutral-200">{post.text}</p>
                </div>
              )) : <p className="text-neutral-500">Nessun post testuale ancora.</p>}
            </div>
          )}

          {activeTab === "arte" && (
            <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {artworks.length > 0 ? artworks.map(post => (
                <div key={post.id} className="break-inside-avoid rounded-2xl overflow-hidden shadow border border-neutral-200 dark:border-neutral-800">
                  <div className="w-full h-auto bg-neutral-200 dark:bg-neutral-800">
                    {post.file?.type.startsWith("image") ? (
                      <img src={URL.createObjectURL(post.file)} alt="post" className="w-full h-auto object-cover" />
                    ) : <div className="aspect-square" />}
                  </div>
                  {post.text && <p className="p-2 text-neutral-800 dark:text-neutral-200">{post.text}</p>}
                </div>
              )) : <p className="text-neutral-500">Nessun contenuto multimediale ancora.</p>}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
