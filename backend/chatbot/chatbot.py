"""
chatbot/chatbot.py
Library AI Chatbot
- Rule-based FAQ matching
- ML: demand prediction integration
- Intent-based response pipeline
"""
import re
from datetime import datetime


# ------------------------------------------------------------------ #
# FAQ Knowledge Base                                                  #
# ------------------------------------------------------------------ #
FAQS = {
    "timing": {
        "patterns": ["timing", "hours", "open", "close", "when", "time"],
        "answer": (
            "📚 Library Hours:\n"
            "• Monday – Friday: 8:00 AM – 8:00 PM\n"
            "• Saturday: 9:00 AM – 5:00 PM\n"
            "• Sunday: Closed\n"
            "• Public Holidays: Closed"
        ),
    },
    "borrow_limit": {
        "patterns": ["how many", "borrow limit", "maximum", "books can i take"],
        "answer": (
            "📖 Borrowing Limits:\n"
            "• Students: Up to 3 books at a time\n"
            "• Staff: Up to 5 books at a time\n"
            "• Loan period: 14 days"
        ),
    },
    "fine": {
        "patterns": ["fine", "penalty", "overdue", "late", "charge"],
        "answer": (
            "💰 Fine Policy:\n"
            "• ₹2 per day per book for overdue returns\n"
            "• Fines must be paid before borrowing new books\n"
            "• Maximum fine: ₹100 per book"
        ),
    },
    "renew": {
        "patterns": ["renew", "extend", "renewal"],
        "answer": (
            "🔄 Renewal Policy:\n"
            "• Books can be renewed once for 7 additional days\n"
            "• Renewal must be done before the due date\n"
            "• Cannot renew if another student has a hold"
        ),
    },
    "lost": {
        "patterns": ["lost", "damage", "torn", "missing"],
        "answer": (
            "⚠️ Lost/Damaged Books:\n"
            "• Report immediately to the librarian\n"
            "• Replacement cost = book's market price + ₹50 processing fee\n"
            "• Your account will be suspended until settled"
        ),
    },
    "membership": {
        "patterns": ["membership", "register", "join", "account", "sign up"],
        "answer": (
            "🎓 Membership:\n"
            "• Students: Use your college registration number\n"
            "• Staff: Use your employee ID\n"
            "• Registration is free and instant through this portal"
        ),
    },
    "available": {
        "patterns": ["available", "stock", "copies", "have the book"],
        "answer": (
            "🔍 To check availability:\n"
            "• Use the search bar on your dashboard\n"
            "• Green badge = available copies\n"
            "• Red badge = all copies borrowed\n"
            "• You can ask me: 'How many copies of [book title] are available?'"
        ),
    },
    "contact": {
        "patterns": ["contact", "librarian", "email", "phone", "help"],
        "answer": (
            "📞 Contact Us:\n"
            "• Email: library@college.edu\n"
            "• Phone: +91-44-1234-5678\n"
            "• Counter: Main Library, Ground Floor\n"
            "• Complaints: library.complaints@college.edu"
        ),
    },
    "rules": {
        "patterns": ["rules", "policy", "policies", "regulations", "allowed"],
        "answer": (
            "📋 Library Rules:\n"
            "• Maintain silence in the reading area\n"
            "• No food or drinks inside\n"
            "• Mobile phones on silent mode\n"
            "• Return books by the due date\n"
            "• Treat books with care"
        ),
    },
}

GREETINGS = {"hi", "hello", "hey", "good morning", "good afternoon", "good evening"}
THANKS = {"thank", "thanks", "thank you", "thx"}


class LibraryChatbot:
    """Simple intent-matching chatbot for library queries."""

    def __init__(self, db=None, Book=None, Transaction=None):
        # Optionally inject db models for live queries
        self.db = db
        self.Book = Book
        self.Transaction = Transaction

    def _normalize(self, text: str) -> str:
        return re.sub(r"[^\w\s]", "", text.lower()).strip()

    def _match_faq(self, text: str) -> str | None:
        for intent, data in FAQS.items():
            for pattern in data["patterns"]:
                if pattern in text:
                    return data["answer"]
        return None

    def _handle_availability_query(self, text: str) -> str | None:
        """If user asks about a specific book's availability, query the DB."""
        if not self.Book or "available" not in text and "copies" not in text:
            return None
        # Extract book title after "of" keyword
        match = re.search(r"(?:of|book|title)\s+(.+)", text)
        if not match:
            return None
        query_title = match.group(1).strip()
        book = self.Book.query.filter(
            self.Book.title.ilike(f"%{query_title}%")
        ).first()
        if not book:
            return f"❌ I couldn't find a book matching '{query_title}'. Please check the spelling."
        return (
            f"📗 **{book.title}** by {book.author}\n"
            f"• Total copies: {book.total_count}\n"
            f"• Available now: {book.available_count}\n"
            f"• Borrowed: {book.total_count - book.available_count}"
        )

    def respond(self, user_input: str) -> str:
        """Main entry point — returns chatbot response string."""
        raw = self._normalize(user_input)

        # Greeting
        if any(g in raw for g in GREETINGS):
            hour = datetime.now().hour
            tod = "morning" if hour < 12 else "afternoon" if hour < 17 else "evening"
            return (
                f"Good {tod}! 👋 I'm your Library Assistant.\n"
                "I can help you with:\n"
                "• Library timings & rules\n"
                "• Borrowing & return policies\n"
                "• Book availability\n"
                "• Fine & renewal info\n\n"
                "What would you like to know?"
            )

        # Thanks
        if any(t in raw for t in THANKS):
            return "You're welcome! 😊 Feel free to ask anything else. Happy reading! 📚"

        # Specific book availability
        avail_resp = self._handle_availability_query(raw)
        if avail_resp:
            return avail_resp

        # FAQ matching
        faq_resp = self._match_faq(raw)
        if faq_resp:
            return faq_resp

        # Fallback
        return (
            "🤔 I'm not sure about that. Here are things I can help with:\n"
            "• **Timing** — 'What are library hours?'\n"
            "• **Fines** — 'What is the late fine?'\n"
            "• **Borrowing** — 'How many books can I borrow?'\n"
            "• **Availability** — 'How many copies of Python Crash Course are available?'\n"
            "• **Contact** — 'How do I contact the librarian?'\n\n"
            "You can also visit the counter for personal assistance! 📖"
        )
