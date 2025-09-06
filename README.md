# EcoFinds – Secondhand Marketplace

EcoFinds is a sustainable secondhand marketplace that connects buyers and sellers of pre-loved items. The platform promotes eco-friendly consumption by extending the lifecycle of products through reuse and resale.

---

## 🌍 Features

- 🛒 **Browse & Search** – Explore listings by category, price, and keywords  
- 📸 **Image Support** – Add product images for better visibility  
- 👤 **User Accounts** – Sellers can list items, buyers can connect and purchase  
- 💬 **Marketplace-like Flow** – Similar to OLX/eBay style listings  
- 🔍 **Category & Filters** – Electronics, Furniture, Clothing, Books, and more  
- ⚡ **Responsive Design** – Works across devices  

---

## 🛠️ Tech Stack

- **Frontend:** React.js (TailwindCSS, shadcn/ui)  
- **Backend:** Node.js / Express (or Spring Boot if applicable)  
- **Database:** MongoDB / PostgreSQL  
- **Search:** Elasticsearch (if integrated)  
- **Authentication:** JWT / OAuth  

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (>=16.x) and npm/yarn  
- Git installed  
- MongoDB/PostgreSQL running locally or on cloud  

### Installation

# Clone the repository
git clone https://github.com/Harshilkh7/ecofinds-secondhand-marketplace.git

# Navigate to project folder
cd ecofinds-secondhand-marketplace

# Install dependencies
npm install

# Start development server
npm run dev

# Backend Setup
cd backend
npm install
npm run start

# Environment Variables
Create a .env file in the root directory with:

- DATABASE_URL="postgresql://ecouser:secret@localhost:5432/ecofinds"
- PORT=4000
- JWT_SECRET=supersecret_change_me
- JWT_EXPIRES=7d

# 📸 Screenshots


# 📖 Usage
- Create an account or log in
- Browse or search for items
- Post a listing with details and images
- Connect with interested buyers/sellers
