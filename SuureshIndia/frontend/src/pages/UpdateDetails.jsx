import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { updatesAPI } from "../services/api";

export default function UpdateDetails() {
    const [update, setUpdate] = useState(null);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        updatesAPI
            .getById(id)
            .then((data) => {
                setUpdate(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [id]);
    
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ padding: "5rem 0" }}>
                    Loading update...
                </div>
                <Footer />
            </>
        );
    }

    if (!update) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ padding: "5rem 0" }}>
                    Update not found.
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <section style={{ padding: "5rem 0" }}>
                <div
                    className="container"
                    style={{ maxWidth: "900px", margin: "0 auto" }}
                >
                    {/* Navigation Buttons */}
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                            marginBottom: "2rem",
                        }}
                    >

                        <Link
                            to="/updates"
                            style={{
                                padding: "10px 20px",
                                border: "1px solid var(--accent)",
                                color: "var(--accent)",
                                textDecoration: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                            }}
                        >
                            ← Back to Updates
                        </Link>
                    </div>

                    <h1
                        style={{
                            fontSize: "3rem",
                            fontWeight: "700",
                            color: "var(--fg)",
                            marginBottom: "1rem",
                        }}
                    >
                        {update.title}
                    </h1>

                    <div
                        style={{
                            color: "var(--accent)",
                            marginBottom: "2rem",
                            fontSize: "1rem",
                        }}
                    >
                        {update.category} • {update.publishDate || (update.createdAt ? new Date(update.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Date unavailable")}
                    </div>

                    <p
                        style={{
                            color: "var(--muted)",
                            lineHeight: "2",
                            fontSize: "1.1rem",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {update.summary || update.description || update.content}
                    </p>

                    {update.link && (
                        <div style={{ marginTop: "2rem" }}>
                            <a href={update.link} target="_blank" rel="noopener noreferrer" style={{
                                display: "inline-block",
                                padding: "12px 24px",
                                background: "var(--accent)",
                                color: "#fff",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                textDecoration: "none"
                            }}>
                                View Attached Link/File
                            </a>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
