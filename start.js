#!/usr/bin/env node

// Suppress deprecation warnings for Railway deployment
process.env.NODE_NO_WARNINGS = '1';

// Start the server
require('./server.js');
