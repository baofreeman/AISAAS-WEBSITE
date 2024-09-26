# **AI Platform by Freeman - SaaS Website**

## **GitHub Repository**

- **Code**: [GitHub Repository](https://github.com/baofreeman/AISAAS-WEBSITE)

## **Live Demo**

- [Visit the Live Site](https://freemanai.store)

## **Project Overview**

"AI Platform by Freeman" is a comprehensive SaaS (Software as a Service) platform designed to provide various AI-powered functionalities. This personal project aims to showcase a range of AI capabilities in a user-friendly interface.

## **Design**

Based on ChatGPT and custom personal designs

## **Team Size**

- **1 Developer** (Personal Project)

## **Technologies Used**

### **Frontend**

- **Framework**: Next.js
- **Languages**: TypeScript, HTML, CSS
- **State Management**: Zustand
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form

### **Backend**

- **Framework**: Next.js (API Routes)
- **Authentication**: NextAuth.js
- **AI Services**: OpenAI API, Replicate API

### **Database**

- **Service**: MySQL with AWS RDS

### **Containerization**

- **Tools**: Docker, Docker Compose

### **Deployment**

- **Server**: AWS EC2
- **Web Server**: Nginx
- **SSL**: Certbot

## **Key Features**

### **Frontend**

- **User Authentication**: Secure login and session management
- **API Integration**: Seamless communication with backend AI services
- **Conversation Creation**: AI-powered chat interactions
- **Image Generation**: AI-based image creation from text prompts
- **Audio Processing**: AI-driven audio interactions and generation
- **Video Creation**: AI-generated video content
- **Multi-modal Interaction**: Integrated text, image, audio, and video functionalities
- **User Dashboard**: Personalized management of AI-generated content
- **Responsive Design**: Optimized for various devices and screen sizes

### **Backend**

- **Secure Authentication**: JWT-based token management
- **RESTful APIs**: Robust endpoints for AI service interactions
- **OpenAI Integration**: Leveraging GPT models for advanced NLP
- **Replicate Integration**: Utilizing diverse AI models for various tasks
- **User Data Management**: Efficient handling of user content and history
- **Rate Limiting**: Fair usage policies and API request management
- **Error Handling**: Comprehensive logging and user-friendly error responses
- **Scalability**: Designed for efficient handling of increasing loads

## **Deployment and Containerization**

This project utilizes Docker and Gitflow for streamlined development and deployment.

### **Docker Containerization**

- **Consistent Environment**: Full-stack Next.js application containerized for consistency across environments
- **Docker Compose**: Efficient container orchestration for simplified management

### **Gitflow Deployment Workflow**

- **Structured Development**: Organized branching model for collaborative development
- **Automated EC2 Deployment**: CI/CD pipeline with GitHub Actions for seamless updates

## **How to Run the Project Locally**

### **Next.js Setup**

1. Clone the repository:

   ```bash
   git clone https://github.com/baofreeman/AISAAS-WEBSITE
   ```

2. Navigate to the project directory:

   ```bash
   cd AI-SAAS
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### **Running with Docker**

1. Ensure Docker and Docker Compose are installed

2. Clone the repository:

   ```bash
   git clone https://github.com/baofreeman/AISAAS-WEBSITE
   ```

3. Navigate to the project directory:

   ```bash
   cd AI-SAAS
   ```

4. Build and start Docker containers:

   ```bash
   docker-compose up --build
   ```

5. Access the application at `http://localhost` in your web browser

6. To stop the containers:
   ```bash
   docker-compose down
   ```

## **Contribution**

While this is a personal project, contributions are welcome. Feel free to fork the repository and submit pull requests.

---

**Thank you for visiting!**
