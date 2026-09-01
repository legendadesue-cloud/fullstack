import Link from "next/link";


export default function Popup() {
  return (
    <div className="popup"> 
        <div className="popup-content">
            <h2>Dont have an profile yet</h2>
            <article>need to add to your exprience give organisations reasons to hire you,
                create a profile now and start applying for opportunities
                gain access to a wide range of events and opportunities that match your skills and interests.
                bluid your profile and showcase your skills, experience.
                <button><Link href="/profile">Create Profile</Link></button>
                <button><Link href="/">Skip</Link></button>
            </article>
        </div>
    </div>
  )
};