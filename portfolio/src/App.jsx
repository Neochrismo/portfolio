import React from 'react'
import Header from './component/SocialLinks'
import LandingSection from './component/LandingSection'
import ContactMeSection from './component/ContactMeSection';
import Footer from './component/Footer';
import Services from './component/KeyServices';
import HeroSection from './component/HeroSection';
import { Box } from '@chakra-ui/react';
import Alert from './component/Alert';
import AIChatWidget from './component/AIChatWidget';

function App(){
  return (
      <Box>
        <Alert />
        <Header />
        <HeroSection />
        <LandingSection />
        <ContactMeSection />
        <Services />
        <Footer />
        <AIChatWidget />
      </Box>
  );
}
export default App



