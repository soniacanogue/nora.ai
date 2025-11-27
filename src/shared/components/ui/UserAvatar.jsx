const UserAvatar = ({ user, collapsed = false }) => {
  const initials =
    user?.nombre
      ?.split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dt-foreground text-dt-primary font-bold text-dt-sm">
      {initials}
    </div>
  );
};

export default UserAvatar;
