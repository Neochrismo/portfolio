import React, { useRef, useEffect } from "react";
import {
  faGithub,
  faInstagram,
  faLinkedin,
  faTwitter,
  faTiktok,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Box, HStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColorModeButton } from "../components/color-mode";

const socials = [
  {
    icon: faEnvelope,
    url: "mailto:stephenniyiadeloye@gmail.com",
    alwaysVisible: true,
  },
  {
    icon: faGithub,
    url: "https://github.com/Neochrismo",
    alwaysVisible: true,
  },
  {
    icon: faTiktok,
    url: "https://www.tiktok.com/@neo_chrismo_web",
    alwaysVisible: false,
  },
  {
    icon: faLinkedin,
    url: "https://www.linkedin.com/in/neochrismo-web-a0758319a",
    alwaysVisible: true,
  },
  {
    icon: faWhatsapp,
    url: "https://wa.me/2348020562579",
    alwaysVisible: false,
  },
  {
    icon: faInstagram,
    url: "https://www.instagram.com/neochrismo55_webtech?igsh=MnBrYTU1N2Jnc294&utm_source=qr",
    alwaysVisible: false,
  },
  {
    icon: faTwitter,
    url: "https://x.com/web_neochrismo?s=21",
    alwaysVisible: false,
  },
];

const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    let prevScrollPos = window.scrollY;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const headerElement = headerRef.current;
      if (!headerElement) return;

      // Don't trigger hide/show at the very top of the page
      if (currentScrollPos < 80) {
        headerElement.style.transform = "translateY(0)";
        prevScrollPos = currentScrollPos;
        return;
      }

      // If scrolling UP, show header immediately. If scrolling DOWN, hide it.
      if (prevScrollPos > currentScrollPos) {
        headerElement.style.transform = "translateY(0)";
      } else {
        headerElement.style.transform = "translateY(-100%)";
      }

      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (anchor) => () => {
    const id = `${anchor}-section`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      transform="translateY(0)"
      transitionProperty="transform"
      transitionDuration="0.3s"
      transitionTimingFunction="ease-in-out"
      // Modern glassmorphism look: semi-transparent background with blur and subtle bottom border
      backgroundColor="rgba(24, 24, 27, 0.85)"
      backdropFilter="blur(10px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.08)"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.25)"
      ref={headerRef}
    >
      <Box color="white" maxWidth="1280px" margin="0 auto">
        <HStack
          px={{ base: 4, md: 16 }}
          py={{ base: 3, md: 5 }}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Social Icons with smooth hover color effect */}
          <nav>
            <HStack gap={4}>
              {socials.map(({ icon, url, alwaysVisible }) => (
                <Box
                  key={url}
                  display={alwaysVisible ? "block" : { base: "none", md: "block" }}
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit" }}
                  >
                    <FontAwesomeIcon
                      icon={icon}
                      size="lg"
                      style={{
                        transition: "color 0.2s ease, transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#a78bfa";
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  </a>
                </Box>
              ))}
            </HStack>
          </nav>

          {/* Navigation Links and Theme Toggle */}
          <nav>
            <HStack gap={{ base: 4, md: 8 }} alignItems="center">
              <Box
                display={{ base: "none", md: "block" }}
                fontWeight="medium"
                cursor="pointer"
                _hover={{ color: "#a78bfa" }}
                transition="color 0.2s"
              >
                <a href="#mymission" onClick={handleClick("mymission")}>
                  Mission
                </a>
              </Box>
              <Box
                fontWeight="medium"
                cursor="pointer"
                _hover={{ color: "#a78bfa" }}
                transition="color 0.2s"
              >
                <a href="#contactme" onClick={handleClick("contactme")}>
                  Contact Me
                </a>
              </Box>
              <ColorModeButton />
            </HStack>
          </nav>
        </HStack>
      </Box>
    </Box>
  );
};

export default Header;