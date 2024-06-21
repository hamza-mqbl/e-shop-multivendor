import React, { useState } from "react";
import boat from "../assets/images/boat.png";
// import { GoDownload } from "react-icons/go";
import images from "../assets/images/images.jpeg";
import damac from "../assets/images/damac.jpg";
import reddy from "../assets/images/reddys.png";
import chegg from "../assets/images/chegg.jpg";
import jubli from "../assets/images/jubbolan.png";
import paisa from "../assets/images/paisa.png";
import pvr from "../assets/images/pvr.png";
import unozo from "../assets/images/unzo.png";
import elevation from "../assets/images/elivation.jpg";
import hudle from "../assets/images/huddle.webp";
import lbb from "../assets/images/llb.png";
import max from "../assets/images/max.png";
import inlunga from "../assets/images/inlingua.png";
import jam from "../assets/images/jamboree.png";
import pat from "../assets/images/pet.png";
import insta from "../assets/images/instamojo.webp";
import pala from "../assets/images/palakasha.png";
import aws from "../assets/images/awfis.png";
import acc from "../assets/images/accacia.jpeg";
import a91 from "../assets/images/a91.webp";
import kyor from "../assets/images/kyor.jpeg";
import niyo from "../assets/images/niyo.png";
import star from "../assets/images/health issurance.webp";
import valu from "../assets/images/value360.avif";
import hire from "../assets/images/harbormoor.png";
import acadru from "../assets/images/acadru.png";
import mingle from "../assets/images/edmingle.jpg";
import miko from "../assets/images/miko.webp";
import isango from "../assets/images/isango.png";
import health from "../assets/images/yubihealth.png";
import consulta from "../assets/images/consulta.png";
import luck from "../assets/images/lucideus.png";
import shacoin from "../assets/images/sahicoin.png";
import siso from "../assets/images/siso.jpeg";
import asima from "../assets/images/aiisma.png";
import neopay from "../assets/images/neopay.jpg";
import family from "../assets/images/Familyfirst.png";
import oxfo from "../assets/images/oxford.jpg";
import qubi from "../assets/images/qubic.svg";
import jug from "../assets/images/juggernut.svg";
import silk from "../assets/images/Silkhaus.png";
import solar from "../assets/images/solar.jpg";
import trip from "../assets/images/tripoto.svg";
import free from "../assets/images/freedom.png";
import ced from "../assets/images/cedarwood.png";
import fine from "../assets/images/finemake.png";
import hyr from "../assets/images/hyrr.png";
import ads from "../assets/images/adsight.png";
import kid from "../assets/images/kidstir.avif";
import sta from "../assets/images/star.png";
import croft from "../assets/images/croftr.png";
import uah from "../assets/images/uah.png";
import loco from "../assets/images/locofast.png";
import gos from "../assets/images/GoSTOPS.png";
import ata from "../assets/images/atadel.png";
import aud from "../assets/images/AuditorsDesk.png";
import estro from "../assets/images/AstroJudge.png";
import next from "../assets/images/edunext.png";
import agro from "../assets/images/Agrowave.svg";
import hopp from "../assets/images/hooper.webp";
import vid from "../assets/images/viden.png";
import learn from "../assets/images/learnengg.jpg";
import nav from "../assets/images/navigator.png";
import arri from "../assets/images/arish.jpeg";
import deli from "../assets/images/delicut.png";
import fifth from "../assets/images/fifthtry.png";
import yarnip from "../assets/images/yarnir.webp";
import zoop from "../assets/images/zooper.png";
import sama from "../assets/images/smagara.webp";
import param from "../assets/images/paramseva.png";
import idc from "../assets/images/idc.svg";
import hero from "../assets/images/hero.png";
import ana from "../assets/images/analyticsvidhya.webp";
import emoha from "../assets/images/emoha.webp";
import vegg from "../assets/images/vegease.jpg";
import better from "../assets/images/better.png";
import nala from "../assets/images/nalanda.png";
import third from "../assets/images/thirdwave.png";
import ven from "../assets/images/ventura.jpg";
import teal from "../assets/images/tealbox.jpeg";
import siri from "../assets/images/sahicoin.png";
import gin from "../assets/images/GINESYS.png";
import ampli from "../assets/images/amplicomm.jpeg";
import ong from "../assets/images/ongrid.png";
import bbb from "../assets/images/bbb.svg";
import ali from "../assets/images/ali.png"
import owner from "../assets/images/owner-squarboat.webp"
import partener from "../assets/images/partner-with-us.svg"
import cat from "../assets/images/cat.jpg"
// import down from "../assets/images/download.webp"
import {HiOutlineMenuAlt3, HiOutlineUserCircle} from "react-icons/hi"
import { ImLinkedin } from "react-icons/im";
import Footer from "../components/footer";
import { Header } from "../components/Header";
import navItemsData from "../components/Navitem.js"

const HomePage = () => {


     const [open, setOpen] = useState(false)
      const [openSidebar, setOpenSidebar] = useState(false)
     const [active, setActive] = useState(false);


      const handelClose = (e) => {
        if (e.target.id === "screen") {
          
            setOpenSidebar(false)
      
        }}
  return (

    <div className="w-full relative h-screen">
     
    <Header/>

     <div className="block lg:flex lg:ml-36 ml-2">
      <div className="block lg:w-[40%] w-full">
        <h1 className="lg:font-bold font-bold text-[20px] lg:text-[35px]">Design driven Success.</h1>
        <h1 className="mt-4">We're a design focused software development <br/>company.</h1>
        <div className="flex mt-6">
        <a href="/" alt="">
        <button className="text-[20px]  border-blue-400 text-white
              border-[2px]  rounded-md bg-blue-500 w-[170px] h-[40px]">
        Company Deck
        </button>
        </a>
         <a href="/client" alt="">
        <button className="text-[20px]  border-blue-400 text-blue-500 hover:text-white hover:bg-blue-600 ml-10
              border-[2px]  rounded-md  w-[170px] h-[40px]">
          See Our Work
        </button>
        </a>
        </div>
      </div>
      <img className="w-[70vh] h-[70vh] ml-24" src={images} alt=""/>
     </div>


      <div className="w-full bg-gray-100 mt-20">
        <h1 className="w-full text-[75px] ml-6 font-extrabold text-blue-200">
          GREAT SOFTWARE EXPERIWNCES
        </h1>
        <div className="text-center ">
          <h1 className="text-blue-600 font-bold text-[20px] mt-16">Our clients</h1>
          <p>
            More than 100+ business have trusted squareboat to grow <br /> using
            design and technology expertise
          </p>
        </div>
        
        <div className="w-[85%] text-center flex m-auto hidden sm:flex mt-10">
          <div className="flex justify-between mt-10 ">
            <img height={140} width={200} src={damac} alt="" className="w-[45vh] h-[10vh]"/>
            <img
              height={100}
              width={300}
              className="ml-14 w-[45vh] h-[10vh]"
              src={reddy}
              alt=""
              
            />
            <img
              height={140}
              width={200}
              className="ml-14 w-[45vh] h-[10vh] mt-2"
              src={chegg}
              alt=""
            />
            <img
              height={140}
              width={200}
              className="ml-14 w-[45vh] h-[10vh]"
              src={jubli}
              alt=""
            />
          </div>
        </div>
        <div className="!w-[85%] hidden sm:flex">
          <div className="flex flex-row justify-between mt-10 ml-[100px]">
            <img className="h-[10vh] w-[40vh]" src={paisa} alt="" />
            <img className="ml-10 h-[10vh] w-[55vh] px-7" src={pvr} alt="" />
            <img className=" ml-32 h-[10vh] w-[45vh]" src={unozo} alt="" />
            <img className="ml-32 h-[10vh] w-[45vh] " src={elevation} alt="" />
          </div>
        </div>
        <div className="bg-gray-100 w-full hidden sm:flex">
          <div className="!w-[85%]">
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[10vh] w-[45vh]" src={hudle} alt="" />
              <img className="ml-20 h-[10vh] w-[45vh]" src={lbb} alt="" />
              <img className=" ml-24 h-[10vh] w-[45vh]" src={max} alt="" />
              <img className="ml-20 h-[15vh] w-[45vh] " src={inlunga} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[45vh]" src={jam} alt="" />
              <img className="ml-20 h-[10vh] w-[45vh]" src={pat} alt="" />
              <img className=" ml-20 h-[10vh] w-[45vh]" src={insta} alt="" />
              <img className="ml-20 h-[10vh] w-[45vh] " src={pala} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={aws} alt="" />
              <img className="ml-20 h-[15vh] w-[30vh]" src={acc} alt="" />
              <img className=" ml-20 h-[15vh] w-[30vh]" src={a91} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={kyor} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={niyo} alt="" />
              <img className="ml-20 h-[15vh] w-[30vh]" src={star} alt="" />
              <img className=" ml-20 h-[15vh] w-[30vh]" src={valu} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={hire} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={acadru} alt="" />
              <img className="ml-20 h-[15vh] w-[30vh]" src={mingle} alt="" />
              <img className=" ml-20 h-[15vh] w-[30vh]" src={miko} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={isango} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={health} alt="" />
              <img className="ml-20 h-[15vh] w-[30vh]" src={consulta} alt="" />
              <img className=" ml-20 h-[15vh] w-[30vh]" src={luck} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={shacoin} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={siso} alt="" />
              <img className="ml-20 h-[15vh] w-[30vh]" src={asima} alt="" />
              <img className=" ml-20 h-[15vh] w-[30vh]" src={neopay} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={family} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={oxfo} alt="" />
              <img className="ml-20 h-[15vh] w-[30vh]" src={qubi} alt="" />
              <img className=" ml-20 h-[15vh] w-[30vh]" src={jug} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={silk} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={solar} alt="" />
              <img className="ml-20 h-[15vh] w-[30vh]" src={trip} alt="" />
              <img className=" ml-20 h-[15vh] w-[30vh]" src={free} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={ced} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={fine} alt="" />
              <img className="ml-20 h-[15vh] w-[30vh]" src={hyr} alt="" />
              <img className=" ml-20 h-[15vh] w-[30vh]" src={ads} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={kid} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={sta} alt="" />
              <img className="ml-20 h-[15vh] w-[30vh]" src={croft} alt="" />
              <img className=" ml-20 h-[15vh] w-[30vh]" src={uah} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={loco} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <h1 className="font-extrabold text-[30px]">woobly</h1>
              <h1 className="font-extrabold text-[30px] ml-20">HUBSCRIBE</h1>
              <h1 className="text-gray-400 font-extrabold text-[30px] ml-20">
                Ad<span className="text-green-300 font-extrabold">MINT</span>
              </h1>
              <img className="ml-20 h-[8vh] w-[40vh]" src={gos} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <h1 className="font-normal text-[30px] mt-6">eZ Recs</h1>
              <h1 className="text-[30px] font-medium text-green-800 ml-28">
                bharat <br />
                <span className="text-green-600">Cattle</span>
              </h1>
              <img className=" ml-28 h-[15vh] w-[30vh]" src={ata} alt="" />
              <img className="ml-20 h-[20vh] w-[40vh] " src={aud} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-6 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={estro} alt="" />
              <img className="ml-20 h-[15vh] w-[40vh]" src={next} alt="" />
              <img className=" h-[15vh] w-[50vh]" src={agro} alt="" />
              <img className="ml-20 h-[10vh] w-[30vh]" src={hopp} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <img className="h-[15vh] w-[30vh]" src={sta} alt="" />
              <img className="ml-20 h-[15vh] w-[60vh]" src={vid} alt="" />
              <img className=" ml-28 h-[15vh] w-[50vh]" src={learn} alt="" />
              <h1 className="text-[30px] font-medium text-red-400 ml-28 mt-6">
                Mav<span className="text-orange-300">Berry</span>
              </h1>
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[100px]">
              <h1 className="text-[30px] font-medium text-blue-400  mt-8">
                Plastic<span className="text-blue-600">Mandi</span>
              </h1>
              <img className="ml-20 h-[8vh] w-[35vh] mt-6" src={nav} alt="" />
              <img className=" ml-20 h-[15vh] w-[50vh]" src={arri} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={deli} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[20px]">
              <img className="ml-20 h-[8vh] w-[35vh] mt-6" src={fifth} alt="" />
              <img
                className="ml-20 h-[8vh] w-[35vh] mt-6"
                src={yarnip}
                alt=""
              />
              <img className=" ml-20 h-[15vh] w-[50vh]" src={zoop} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={sama} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[20px]">
              <img className="ml-20 h-[8vh] w-[35vh] mt-6" src={param} alt="" />
              <img className="ml-20 h-[8vh] w-[35vh] mt-6" src={idc} alt="" />
              <img className=" ml-20 h-[15vh] w-[50vh]" src={hero} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] " src={ana} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[20px]">
              <img className="ml-20 h-[15vh] w-[45vh] mt-6" src={emoha} alt="" />
              <h1 className="font-extrabold text-[30px] ml-20 mt-10">HUBSCRIBE</h1>
              <img className=" ml-20 h-[15vh] w-[50vh]" src={vegg} alt="" />
              <img className="ml-20 h-[15vh] w-[40vh] " src={better} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[20px]">
              <img className="ml-20 h-[8vh] w-[35vh] mt-6" src={nala} alt="" />
              <img className="ml-20 h-[10vh] w-[40vh] mt-6" src={third} alt="" />
              <img className=" ml-20 h-[13vh] w-[50vh]" src={ven} alt="" />
              <img className="ml-20 h-[10vh] w-[35vh] " src={teal} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[20px] bg-gray-100">
              <img className="ml-20 h-[8vh] w-[35vh] mt-6" src={siri} alt="" />
              <img className="ml-20 h-[6vh] w-[35vh] mt-6" src={gin} alt="" />
              <img className=" ml-20 h-[12vh] w-[50vh]" src={ampli} alt="" />
              <img className="ml-20 mt-4 h-[10vh] w-[40vh] " src={ong} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[20px]">
              <img className="ml-20 h-[10vh] w-[20vh] " src={bbb} alt="" />
            </div>
            <div className="flex flex-row justify-between mt-10 ml-[80px] text-center">
              <a href="/client">
              <button className="text-[20px] hover:text-white hover:bg-blue-600 ml-[500px] mt-15 border-blue-400 text-blue-600 
              border-[2px] p-4 rounded-full">
                show more
              </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="!text-center mt-20 p-4 mr-10 m-auto block w-[90%]">
        <h1 className="text-[40px] font-semibold text-blue-700">Our range of services</h1>
      <p>we pride ourselves on building successfull, end to end web and <br/> mobile applications</p>
      </div>
      <div class="mt-[30px] w-[85%] text-center ml-28 flex flex-wrap lg:flex-nowrap">
  <div class="w-full lg:w-1/3 lg:block flex justify-center items-center">
    <div class="block text-center">
      <h1 class="text-2xl font-bold">Web & App Development</h1>
      <p class="mt-6">We build beautiful, responsive and feature-rich websites and applications that solve real customer problems</p>
    </div>
  </div>
  <div class="w-full lg:w-1/3 lg:ml-6 mt-6 lg:mt-0 flex justify-center items-center">
    <div class="block text-center">
      <h1 class="text-2xl font-bold">UI / UX design</h1>
      <p class="mt-6">Grid Design Studio is known for crafting experiences through the power of UI/UX design.</p>
    </div>
  </div>
  <div class="w-full lg:w-1/3 lg:ml-6 mt-6 lg:mt-0 flex justify-center items-center">
    <div class="block text-center">
      <h1 class="text-2xl font-bold">AI and ML</h1>
      <p class="mt-6">Revolutionizing IT solutions with cutting-edge AI services. Enhancing efficiency and driving innovation for your business</p>
    </div>
  </div>
</div>


<div class="flex flex-col lg:flex-row text-center items-center justify-center mt-20 lg:ml-44">
  <div class="w-full lg:w-1/2 lg:block flex justify-center lg:justify-center">
    <div class="block w-full lg:w-[75%]">
      <h1 class="text-2xl font-bold">DevOps</h1>
      <p class="mt-4">We've worked on websites handling more than 10 million hits/day. We can scale your products too.</p>
    </div>
  </div>
  <div class="w-full lg:w-1/2 lg:block mt-6 lg:mt-0 flex justify-center lg:justify-center">
    <div class="block w-full lg:w-[75%] ml-0 lg:ml-6">
      <h1 class="text-2xl font-bold">Staff Augmentation</h1>
      <p class="mt-4">With Crewmate, you can instantly onboard our exceptional team of developers and designers in less than 24 hours.</p>
    </div>
  </div>
</div>


       <div class="flex flex-col lg:flex-row justify-center items-center mt-10 lg:ml-[80px] text-center lg:mt-20">
  <a href="/tech-stack">
    <button class="text-lg lg:text-xl hover:text-white hover:bg-blue-600 mt-4 lg:mt-0 lg:ml-4 lg:mt-15 border-blue-400
     text-blue-600 border-[2px] lg:border-[2px] p-4 lg:px-6 rounded-full">
      View our portfolio
    </b