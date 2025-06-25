<template>
  <div class="layout-wrapper">
    <!-- HEADER -->
    <div class="header">
      <div class="toolbar">
        <img src="/images/logo.png" alt="Logomark" class="logo" />
        <div class="title-area">
          <h1 class="title">NBA Analytics</h1>

          <!-- BREADCRUMBS -->
          <nav v-if="breadcrumb?.length" class="breadcrumbs">
            <template v-for="(item, index) in breadcrumb" :key="index">
              <a @click.prevent="navigate(item.route)" class="breadcrumb-link">{{ item.title }}</a>
              <span v-if="index < breadcrumb.length - 1" class="breadcrumb-separator">›</span>
            </template>
          </nav>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <main class="main-content">
      <div class="content-container">
        <slot />
      </div>
    </main>

    <!-- FOOTER -->
    <div class="footer">
      <p>© {{ year }} By Sérgio F. Paim</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const year = new Date().getFullYear()

// Breadcrumbs (exemplo fixo por enquanto)
const breadcrumb = ref([
  { title: 'Home', route: '/' },
  { title: 'Record', route: '/record' }
])

const router = useRouter()

function navigate(route) {
  router.push(route)
}
</script>

<style scoped>
.layout-wrapper {
  font-family: "Geomanist", "Helvetica", "Arial", sans-serif;
  min-height: 100vh;
  background-color: #00438C;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent entire page scrolling */
}

/* Header Styles */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  min-height: 70px;
  background-color: #00438C;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  padding: 10px 15px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.733);
}

.toolbar {
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}

.logo {
  height: 50px;
  padding-right: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.title-area {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0; /* Allows text truncation */
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  padding-top: 5px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.breadcrumbs {
  margin-top: 5px;
  font-weight: 700;
  color: #ffffff;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.breadcrumb-link {
  cursor: pointer;
  color: #ffffff;
  text-decoration: none;
  margin-right: 5px;
}

.breadcrumb-separator {
  margin-right: 5px;
  color: #ffffff;
}

/* Main Content Styles */
.main-content {
  position: fixed;
  top: 70px;
  bottom: 40px;
  left: 0;
  right: 0;
  overflow: hidden; /* Disable scrolling */
  background-color: #00438C;
  width: 100%;
}

.content-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Footer Styles */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: #f2f2f2;
  color: #00438C;
  display: flex;             
  align-items: center;      
  justify-content: center; 
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  font-size: 0.9rem;
}

.footer p {
  margin: 0;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Media Queries for Responsive Adjustments */
@media (max-width: 480px) {
  .header {
    padding: 8px 10px;
    min-height: 60px;
  }
  
  .logo {
    height: 90px;
    padding-right: 10px;
  }
  
  .title {
    font-size: 1.2rem;
  }
  
  .breadcrumbs {
    font-size: 0.8rem;
  }
  
  .main-content {
    top: 60px;
    bottom: 35px;
  }
  
  .footer {
    height: 35px;
    font-size: 0.8rem;
  }
}

@media (min-width: 768px) {
  .header {
    height: 100px;
    padding: 0 20px;
  }
  
  .logo {
    height: 80px;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .breadcrumbs {
    font-size: 1rem;
  }
  
  .main-content {
    top: 100px;
    bottom: 50px;
  }
  
  .footer {
    height: 50px;
  }
}
</style>