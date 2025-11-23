export const mockUser = {
    id: "u1",
    username: "Alice",
    avatar_url: "https://i.pravatar.cc/50?img=5",
  };
  
  export const mockContacts = [
    { id: "u2", username: "Bob", avatar_url: "https://i.pravatar.cc/50?img=6", online: true },
    { id: "u3", username: "Charlie", avatar_url: "https://i.pravatar.cc/50?img=7", online: false },
  ];
  
  export const mockMessages = {
    u2: [
      { id: "m1", sender_id: "u2", receiver_id: "u1", content: "Ciao Alice!", created_at: new Date() },
    ],
    u3: [],
  };
  