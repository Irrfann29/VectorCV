"""
Seeds 30 real Indian tech company job listings into PostgreSQL.
Run once after setting up the database:
    python -m app.db.seed
"""
import asyncio
from app.db.database import engine, AsyncSessionLocal, Base
from app.models.models import Job


SEED_JOBS = [
    # ── FULL STACK ─────────────────────────────────────────────────────────────
    {
        "title": "Full Stack Developer", "company": "Razorpay",
        "location": "Bangalore", "domain": "fullstack", "level": "junior",
        "skills_required": ["React", "Node.js", "MongoDB", "TypeScript", "REST APIs", "Git"],
        "description": "Build and maintain full stack features for India's leading payment infrastructure. Work with React frontend and Node.js microservices at scale.",
        "salary_min": 800000, "salary_max": 1400000,
        "apply_url": "https://razorpay.com/jobs",
    },
    {
        "title": "Full Stack Engineer", "company": "CRED",
        "location": "Bangalore", "domain": "fullstack", "level": "mid",
        "skills_required": ["React", "Node.js", "PostgreSQL", "Redis", "Docker", "TypeScript"],
        "description": "Build high-scale financial products for India's most creditworthy users. Own features end-to-end on our platform team.",
        "salary_min": 1500000, "salary_max": 2500000,
        "apply_url": "https://careers.cred.club",
    },
    {
        "title": "Software Engineer — Full Stack", "company": "Swiggy",
        "location": "Bangalore", "domain": "fullstack", "level": "junior",
        "skills_required": ["React", "Python", "Django", "PostgreSQL", "AWS", "REST APIs"],
        "description": "Join Swiggy's consumer platform team. Build features that serve 50M+ users ordering food daily across India.",
        "salary_min": 900000, "salary_max": 1600000,
        "apply_url": "https://careers.swiggy.com",
    },
    {
        "title": "Full Stack Developer", "company": "Meesho",
        "location": "Bangalore", "domain": "fullstack", "level": "fresher",
        "skills_required": ["React", "Node.js", "MongoDB", "JavaScript", "HTML", "CSS"],
        "description": "Join Meesho's social commerce platform. Fresh graduates welcome — high ownership from day one.",
        "salary_min": 600000, "salary_max": 950000,
        "apply_url": "https://meesho.io/jobs",
    },
    {
        "title": "Product Engineer", "company": "Zepto",
        "location": "Mumbai", "domain": "fullstack", "level": "junior",
        "skills_required": ["React", "Node.js", "PostgreSQL", "Docker", "Redis"],
        "description": "Own features end-to-end at Zepto — India's fastest 10-minute grocery delivery app. High pace, high impact.",
        "salary_min": 1000000, "salary_max": 1800000,
        "apply_url": "https://www.zeptonow.com/careers",
    },
    # ── BACKEND ────────────────────────────────────────────────────────────────
    {
        "title": "Backend Engineer", "company": "PhonePe",
        "location": "Bangalore", "domain": "backend", "level": "mid",
        "skills_required": ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Microservices", "AWS"],
        "description": "Design and build highly available payment processing systems handling 500M+ transactions. India's largest UPI platform.",
        "salary_min": 1800000, "salary_max": 3000000,
        "apply_url": "https://careers.phonepe.com",
    },
    {
        "title": "SDE-1 Backend", "company": "Amazon",
        "location": "Hyderabad", "domain": "backend", "level": "junior",
        "skills_required": ["Java", "Python", "AWS", "DynamoDB", "System Design", "Data Structures"],
        "description": "Join Amazon's engineering org. Build distributed systems at global scale. Competitive pay with ESOPs.",
        "salary_min": 1600000, "salary_max": 2200000,
        "apply_url": "https://amazon.jobs",
    },
    {
        "title": "SDE-2 Backend", "company": "Google",
        "location": "Hyderabad", "domain": "backend", "level": "mid",
        "skills_required": ["Golang", "gRPC", "Kubernetes", "Distributed Systems", "System Design", "Python"],
        "description": "Build Google-scale infrastructure for products used by billions. Work with world-class engineers.",
        "salary_min": 3000000, "salary_max": 5000000,
        "apply_url": "https://careers.google.com",
    },
    {
        "title": "Backend Developer", "company": "Zomato",
        "location": "Gurugram", "domain": "backend", "level": "junior",
        "skills_required": ["Golang", "Python", "MySQL", "Redis", "Kafka", "Docker"],
        "description": "Build backend services for Zomato's food delivery and dining platform serving 100M+ users.",
        "salary_min": 900000, "salary_max": 1600000,
        "apply_url": "https://www.zomato.com/careers",
    },
    {
        "title": "Backend Engineer", "company": "Nykaa",
        "location": "Mumbai", "domain": "backend", "level": "junior",
        "skills_required": ["Node.js", "MySQL", "Redis", "AWS", "Docker", "REST APIs"],
        "description": "Build scalable APIs for India's leading beauty and fashion e-commerce platform.",
        "salary_min": 700000, "salary_max": 1300000,
        "apply_url": "https://careers.nykaa.com",
    },
    {
        "title": "SDE-1", "company": "Flipkart",
        "location": "Bangalore", "domain": "backend", "level": "fresher",
        "skills_required": ["Java", "Data Structures", "Algorithms", "SQL", "Problem Solving"],
        "description": "Flipkart LEAP campus hire. Join India's largest e-commerce company. Training + mentorship.",
        "salary_min": 1400000, "salary_max": 1800000,
        "apply_url": "https://www.flipkartcareers.com",
    },
    # ── FRONTEND ───────────────────────────────────────────────────────────────
    {
        "title": "Frontend Engineer", "company": "Zomato",
        "location": "Delhi NCR", "domain": "frontend", "level": "junior",
        "skills_required": ["React", "TypeScript", "CSS", "HTML", "Redux", "Jest"],
        "description": "Build fast interfaces for Zomato's consumer apps used by 100M+ Indians.",
        "salary_min": 800000, "salary_max": 1500000,
        "apply_url": "https://www.zomato.com/careers",
    },
    {
        "title": "Senior Frontend Developer", "company": "Flipkart",
        "location": "Bangalore", "domain": "frontend", "level": "senior",
        "skills_required": ["React", "TypeScript", "GraphQL", "Microfrontends", "Performance Optimization"],
        "description": "Lead frontend architecture for Flipkart's core shopping experience. Mentor engineers.",
        "salary_min": 2500000, "salary_max": 4000000,
        "apply_url": "https://www.flipkartcareers.com",
    },
    {
        "title": "React Developer", "company": "Paytm",
        "location": "Noida", "domain": "frontend", "level": "junior",
        "skills_required": ["React", "Redux", "JavaScript", "REST APIs", "HTML", "CSS"],
        "description": "Build fintech UI features for Paytm's payment, banking, and insurance products.",
        "salary_min": 700000, "salary_max": 1200000,
        "apply_url": "https://paytm.com/careers",
    },
    {
        "title": "UI Developer", "company": "Infosys",
        "location": "Pune", "domain": "frontend", "level": "fresher",
        "skills_required": ["React", "JavaScript", "HTML", "CSS", "Bootstrap"],
        "description": "Join Infosys Digital Experience team. Build enterprise UI for Fortune 500 clients.",
        "salary_min": 400000, "salary_max": 700000,
        "apply_url": "https://www.infosys.com/careers",
    },
    # ── DATA SCIENCE / ANALYTICS ───────────────────────────────────────────────
    {
        "title": "Data Analyst", "company": "Flipkart",
        "location": "Bangalore", "domain": "data", "level": "junior",
        "skills_required": ["Python", "SQL", "Pandas", "Tableau", "Excel", "Statistics"],
        "description": "Analyze business metrics, build dashboards, and drive data-informed decisions.",
        "salary_min": 700000, "salary_max": 1200000,
        "apply_url": "https://www.flipkartcareers.com",
    },
    {
        "title": "Data Scientist", "company": "Swiggy",
        "location": "Bangalore", "domain": "data", "level": "mid",
        "skills_required": ["Python", "Machine Learning", "SQL", "Scikit-learn", "TensorFlow", "Spark"],
        "description": "Build ML models for demand forecasting, recommendations, and ETA prediction.",
        "salary_min": 1500000, "salary_max": 2500000,
        "apply_url": "https://careers.swiggy.com",
    },
    {
        "title": "ML Engineer", "company": "Meesho",
        "location": "Bangalore", "domain": "data", "level": "mid",
        "skills_required": ["Python", "PyTorch", "NLP", "MLOps", "AWS SageMaker", "SQL"],
        "description": "Build and deploy ML models for search ranking, recommendations, and fraud detection.",
        "salary_min": 1600000, "salary_max": 2800000,
        "apply_url": "https://meesho.io/jobs",
    },
    {
        "title": "Data Engineer", "company": "Razorpay",
        "location": "Bangalore", "domain": "data", "level": "junior",
        "skills_required": ["Python", "Spark", "Airflow", "SQL", "AWS", "Kafka"],
        "description": "Build data pipelines to power analytics and ML for Razorpay's payment platform.",
        "salary_min": 1000000, "salary_max": 1800000,
        "apply_url": "https://razorpay.com/jobs",
    },
    {
        "title": "Business Analyst", "company": "TCS",
        "location": "Mumbai", "domain": "data", "level": "fresher",
        "skills_required": ["Excel", "SQL", "Power BI", "Python", "Statistics"],
        "description": "Entry-level BA role for TCS's global banking clients. Structured training included.",
        "salary_min": 350000, "salary_max": 600000,
        "apply_url": "https://www.tcs.com/careers",
    },
    # ── DEVOPS / CLOUD ─────────────────────────────────────────────────────────
    {
        "title": "DevOps Engineer", "company": "PhonePe",
        "location": "Bangalore", "domain": "devops", "level": "mid",
        "skills_required": ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Linux"],
        "description": "Manage and automate cloud infrastructure for PhonePe's 99.99% uptime payment systems.",
        "salary_min": 1400000, "salary_max": 2500000,
        "apply_url": "https://careers.phonepe.com",
    },
    {
        "title": "Cloud Engineer", "company": "Microsoft",
        "location": "Hyderabad", "domain": "devops", "level": "mid",
        "skills_required": ["Azure", "Kubernetes", "Docker", "Terraform", "CI/CD", "Python"],
        "description": "Work on Azure cloud infrastructure projects for Microsoft's enterprise clients.",
        "salary_min": 1600000, "salary_max": 2800000,
        "apply_url": "https://careers.microsoft.com",
    },
    {
        "title": "Junior DevOps Engineer", "company": "Wipro",
        "location": "Bangalore", "domain": "devops", "level": "fresher",
        "skills_required": ["Linux", "Docker", "Git", "Jenkins", "AWS Basics", "Shell Scripting"],
        "description": "Entry-level DevOps role. Structured training, good growth into SRE or Cloud.",
        "salary_min": 400000, "salary_max": 700000,
        "apply_url": "https://careers.wipro.com",
    },
    {
        "title": "SRE Engineer", "company": "Google",
        "location": "Hyderabad", "domain": "devops", "level": "mid",
        "skills_required": ["Linux", "Python", "Kubernetes", "Prometheus", "Golang", "Networking"],
        "description": "Keep Google's services reliable at global scale. Build automation, respond to incidents.",
        "salary_min": 2500000, "salary_max": 4500000,
        "apply_url": "https://careers.google.com",
    },
    # ── MOBILE ─────────────────────────────────────────────────────────────────
    {
        "title": "React Native Developer", "company": "Nykaa",
        "location": "Mumbai", "domain": "mobile", "level": "junior",
        "skills_required": ["React Native", "Redux", "JavaScript", "iOS", "Android", "Firebase"],
        "description": "Build Nykaa's beauty e-commerce mobile app for iOS and Android. 10M+ downloads.",
        "salary_min": 800000, "salary_max": 1400000,
        "apply_url": "https://careers.nykaa.com",
    },
    {
        "title": "Android Developer", "company": "Paytm",
        "location": "Noida", "domain": "mobile", "level": "mid",
        "skills_required": ["Kotlin", "Android SDK", "MVVM", "Coroutines", "Jetpack Compose", "REST APIs"],
        "description": "Build Android features for 350M+ Paytm users. Own critical payment and banking flows.",
        "salary_min": 1200000, "salary_max": 2000000,
        "apply_url": "https://paytm.com/careers",
    },
    {
        "title": "iOS Developer", "company": "CRED",
        "location": "Bangalore", "domain": "mobile", "level": "mid",
        "skills_required": ["Swift", "iOS SDK", "SwiftUI", "CoreData", "Combine", "REST APIs"],
        "description": "Build premium iOS experiences for CRED's high-credit-score user base.",
        "salary_min": 1500000, "salary_max": 2500000,
        "apply_url": "https://careers.cred.club",
    },
    # ── GENERAL / FRESHER ─────────────────────────────────────────────────────
    {
        "title": "Software Development Engineer", "company": "Amazon",
        "location": "Bangalore", "domain": "backend", "level": "fresher",
        "skills_required": ["Data Structures", "Algorithms", "Java", "Python", "System Design Basics"],
        "description": "Amazon SDE-1 campus hire. Best-in-class pay, world-class mentorship.",
        "salary_min": 1400000, "salary_max": 1900000,
        "apply_url": "https://amazon.jobs",
    },
    {
        "title": "Software Engineer", "company": "TCS",
        "location": "Multiple Cities", "domain": "fullstack", "level": "fresher",
        "skills_required": ["Java", "SQL", "HTML", "CSS", "JavaScript", "Problem Solving"],
        "description": "TCS NQT hire. Rotational program across domains — web, data, cloud.",
        "salary_min": 350000, "salary_max": 450000,
        "apply_url": "https://www.tcs.com/careers",
    },
    {
        "title": "Software Engineer", "company": "Infosys",
        "location": "Mysore", "domain": "fullstack", "level": "fresher",
        "skills_required": ["Java", "Python", "SQL", "Data Structures", "Algorithms"],
        "description": "Infosys InfyTQ campus hire. 6-month training in Mysore included.",
        "salary_min": 360000, "salary_max": 480000,
        "apply_url": "https://www.infosys.com/careers",
    },
    {
        "title": "Associate Software Engineer", "company": "Wipro",
        "location": "Hyderabad", "domain": "fullstack", "level": "fresher",
        "skills_required": ["Java", "Python", "SQL", "HTML", "CSS", "REST APIs", "Git"],
        "description": "Wipro ELITE fresher hire. Work with global clients across BFSI, retail, healthcare.",
        "salary_min": 350000, "salary_max": 500000,
        "apply_url": "https://careers.wipro.com",
    },
]


async def seed():
    # Create all tables first
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        from sqlalchemy import select, func
        result = await session.execute(select(func.count()).select_from(Job))
        count  = result.scalar()

        if count > 0:
            print(f"✅ Database already has {count} jobs. Skipping seed.")
            return

        for job_data in SEED_JOBS:
            session.add(Job(**job_data, source="seeded"))

        await session.commit()
        print(f"✅ Seeded {len(SEED_JOBS)} Indian tech jobs!")
        print("   Companies included:")
        companies = list({j["company"] for j in SEED_JOBS})
        companies.sort()
        print(f"   {', '.join(companies)}")


if __name__ == "__main__":
    asyncio.run(seed())
