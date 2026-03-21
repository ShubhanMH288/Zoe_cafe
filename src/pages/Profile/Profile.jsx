import React, { useEffect, useState } from "react";
import "./Profile.css";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        name: "",
        mobile: "",
        email: "",
        location: "",
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            setUser(currentUser);

            try {
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setProfile(userSnap.data());
                } else {
                    setProfile({
                        name: "",
                        mobile: "",
                        email: currentUser.email || "",
                        location: "",
                    });
                }

                const ordersRef = collection(db, "orders");
                const q = query(ordersRef, where("userId", "==", currentUser.uid));
                const orderSnap = await getDocs(q);

                const orderList = orderSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setOrders(orderList);
            } catch (error) {
                console.log("Error loading profile:", error);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            await setDoc(doc(db, "users", user.uid), {
                name: profile.name,
                mobile: profile.mobile,
                email: user.email,
                location: profile.location,
            });


            alert("Profile updated successfully");
        } catch (error) {
            console.log("Error saving profile:", error);
            alert("Failed to update profile");
        }
    };

    if (loading) return <h2 className="profile-loading">Loading...</h2>;

    if (!user) {
        return <h2 className="profile-loading">Please login to view your profile.</h2>;
    }

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h1>My Profile</h1>

                <div className="profile-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={profile.name}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={profile.mobile}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={profile.email }
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={profile.location}
                        onChange={handleChange}
                    />

                    <button onClick={handleSave}>Save Profile</button>
                </div>
            </div>

            
        </div>
    );
};

export default Profile;