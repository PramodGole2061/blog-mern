import { Link } from "react-router-dom";

import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";

import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

//Do not use the name Footer for this component as it will conflict with the Footer import from flowbite-react
export default function FooterSection() {
  return (
    <Footer container>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="mb-5">
            <Link to='/' className="self-center text-lg sm:text-xl whitespace-nowrap font-semibold dark:text-white">
            <span className="px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
                Pramod's
            </span>
            Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <FooterTitle title="about" />
              <FooterLinkGroup col>
                <FooterLink href="/about">Pramod's Blog</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Follow us" />
              <FooterLinkGroup col>
                <FooterLink href="https://github.com/PramodGole2061">Github</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Legal" />
              <FooterLinkGroup col>
                <FooterLink href="/about">Privacy Policy</FooterLink>
                <FooterLink href="/about">Terms &amp; Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          {/* new Date().getFullYear() will update automatically to the current year */}
          <FooterCopyright href="/about" by="Pramod's Blog" year={new Date().getFullYear()} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterIcon href="https://www.facebook.com/pramog.gole.7/" icon={BsFacebook} />
            <FooterIcon href="https://github.com/PramodGole2061" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  )
}
