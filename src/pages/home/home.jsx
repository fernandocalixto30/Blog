import  {Header}  from '../header/header.jsx';
import './style.css'

const Home = () => {

  return (
    <>
    <Header/>
<section className='container-posts'>
  <div className='post'>
    <div className='post-content'>

   
    <h1>Mas, afinal, o que é programação?</h1>
    <div>
      <p>A Programação é o processo de criar um conjunto de instruções que um computador segue para realizar determinadas tarefas específicas. Em outras palavras, é a arte de ensinar máquinas a resolver problemas. Essas instruções são escritas em linguagens de programação, como Python, JavaScript, Java e muitas outras, dependendo da aplicação e da complexidade do projeto.</p>
    </div>
     </div>
     <div className='post-img'>
      <img src="https://www.usnews.com/cmsmedia/a7/b4/fc82a15549afac6b47117ceb53b1/161031-stock.jpg" alt="" />
     </div>
     
  </div>
  <div className='post'>
    <div className='post-content'>

   
    <h1>Mas, afinal, o que é programação?</h1>
    <div>
      <p>A Programação é o processo de criar um conjunto de instruções que um computador segue para realizar determinadas tarefas específicas. Em outras palavras, é a arte de ensinar máquinas a resolver problemas. Essas instruções são escritas em linguagens de programação, como Python, JavaScript, Java e muitas outras, dependendo da aplicação e da complexidade do projeto.</p>
    </div>
     </div>
     <div className='post-img'>
      <img src="https://www.usnews.com/cmsmedia/a7/b4/fc82a15549afac6b47117ceb53b1/161031-stock.jpg" alt="" />
     </div>




     
  </div>
 </section>
 </>
  )
}

export default Home