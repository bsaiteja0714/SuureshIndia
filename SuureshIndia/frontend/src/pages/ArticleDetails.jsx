import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { articlesAPI } from "../services/api";

export default function ArticleDetails() {


    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        articlesAPI
            .getById(id)
            .then((data) => {
                setArticle(data);
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
                    Loading article...
                </div>
                <Footer />
            </>
        );
    }

    if (!article) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ padding: "5rem 0" }}>
                    Article not found.
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
                            to="/journal"
                            style={{
                                padding: "10px 20px",
                                border: "1px solid var(--accent)",
                                color: "var(--accent)",
                                textDecoration: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                            }}
                        >
                            ← Back to Journal
                        </Link>
                    </div>

                    <h1
                        style={{
                            fontSize: "3rem",
                            fontWeight: "700",
                            color: "white",
                            marginBottom: "1rem",
                        }}
                    >
                        {article.title}
                    </h1>

                    <div
                        style={{
                            color: "var(--accent)",
                            marginBottom: "2rem",
                            fontSize: "1rem",
                        }}
                    >
                        {article.category} • {article.publishDate}
                    </div>

                    <p
                        style={{
                            color: "#d1d5db",
                            lineHeight: "2",
                            fontSize: "1.1rem",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {article.content}
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}
