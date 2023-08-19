<template>
  <div class="navbar flex justify-between bg-base-100 z-10 shadow-md">
    <!--Menu toogle for mobile view or small screen-->
    <div class="">
      <!-- <label
        for="left-sidebar-drawer"
        class="btn btn-primary drawer-button lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
          class="h-5 inline-block w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          ></path>
        </svg>
      </label> -->
      <h1 class="text-2xl font-semibold ml-2">{{ pageTitle }}</h1>
    </div>

    <div class="order-last">
      <!-- Notification icon @click="openNotification" -->
      <!-- <button class="btn btn-ghost ml-4 btn-circle">
        <div class="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            ></path>
          </svg>
          {Notifications.length > 0 ? <span class="indicator-item badge badge-secondary badge-sm">{noOfNotifications}</span> : null }}
        </div>
      </button> -->

      <!-- Profile icon, opening menu on click -->
      <div class="dropdown dropdown-end ml-4">
        <label tabIndex="{0}" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
        </label>
        <ul
          tabIndex="{0}"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <!-- <li class="justify-between">
            <a>
              Profile Settings
              <span class="badge">New</span>
            </a>
          </li>
          <li class=""><a>Bill History</a></li>
          <div class="divider mt-0 mb-0"></div> -->
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const pageTitle = ref("");
</script>
