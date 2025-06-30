#!/bin/bash

# Mailed - Production Deployment Script
echo "🚀 Starting Mailed deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ git is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies found${NC}"
}

# Build frontend
build_frontend() {
    echo "🏗️  Building frontend..."
    
    # Install dependencies
    npm install
    
    # Build for production
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend build successful${NC}"
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
}

# Validate build
validate_build() {
    echo "🔍 Validating build..."
    
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ Build directory not found${NC}"
        exit 1
    fi
    
    if [ ! -f "dist/index.html" ]; then
        echo -e "${RED}❌ index.html not found in build${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Build validation passed${NC}"
}

# Deploy instructions
deployment_instructions() {
    echo ""
    echo "🎯 Deployment Instructions:"
    echo "=========================="
    echo ""
    echo "1. 📂 Frontend (Netlify):"
    echo "   - Go to https://netlify.com"
    echo "   - Drag and drop the 'dist' folder"
    echo "   - Or connect GitHub for auto-deployment"
    echo ""
    echo "2. 🖥️  Backend (Render):"
    echo "   - Go to https://render.com"
    echo "   - Create new Web Service"
    echo "   - Connect your GitHub repository"
    echo "   - Set build command: cd server && npm install"
    echo "   - Set start command: cd server && npm start"
    echo ""
    echo "3. 🗄️  Database (Supabase):"
    echo "   - Go to https://supabase.com"
    echo "   - Create new project"
    echo "   - Run the SQL migration from DEPLOYMENT.md"
    echo ""
    echo "4. 🔧 Configuration:"
    echo "   - Update Google OAuth settings"
    echo "   - Set environment variables in Render"
    echo "   - Update CORS URLs in backend"
    echo ""
    echo -e "${YELLOW}📖 For detailed instructions, see DEPLOYMENT.md${NC}"
}

# Main execution
main() {
    echo "🚀 Mailed - Production Deployment"
    echo "================================="
    echo ""
    
    check_dependencies
    build_frontend
    validate_build
    deployment_instructions
    
    echo ""
    echo -e "${GREEN}🎉 Build complete! Ready for deployment${NC}"
    echo -e "${YELLOW}📁 Upload the 'dist' folder to Netlify${NC}"
}

# Run main function
main 