# Vercel Deployment Guide

This guide will help you deploy the frontend to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your backend already deployed on Render at: https://lc-app-1wte.onrender.com

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to the frontend directory**:
   ```bash
   cd Front-End
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

5. **During deployment, you'll be prompted**:
   - Set the **Root Directory** to: `Front-End` (or just `./` if already in that directory)
   - Set **Environment Variable**: 
     - Name: `VITE_API_BASE_URL`
     - Value: `https://lc-app-1wte.onrender.com/api`

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub** (if not already done)

2. **Go to Vercel Dashboard**: https://vercel.com/dashboard

3. **Click "Add New Project"**

4. **Import your Git repository**

5. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `Front-End`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Add Environment Variable**:
   - Go to **Settings** → **Environment Variables**
   - Add a new variable:
     - **Name**: `VITE_API_BASE_URL`
     - **Value**: `https://lc-app-1wte.onrender.com/api`
     - **Environment**: Production, Preview, Development (select all)

7. **Deploy**: Click "Deploy"

## Important Notes

- The backend API URL is configured via the `VITE_API_BASE_URL` environment variable
- Make sure your Render backend allows CORS requests from your Vercel domain
- After deployment, your frontend will be available at a URL like: `https://your-project-name.vercel.app`

## Verify Deployment

1. Visit your Vercel deployment URL
2. Check the browser console for any API connection errors
3. Test login functionality to ensure it connects to your Render backend

## Troubleshooting

- **CORS Errors**: Make sure your backend on Render allows requests from your Vercel domain
- **API Connection Issues**: Verify the `VITE_API_BASE_URL` environment variable is set correctly in Vercel
- **Build Errors**: Check that all dependencies are listed in `package.json`

