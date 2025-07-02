import React from 'react';
import '../css/institucional-publico.css';

const Institucional = () => {
  return (
    <div className="institucional-container">
      <div className="institucional-header">
        <div className="institucional-nav">
          <div className="institucional-logo">
            <div className="logo-icon">M</div>
            <div className="logo-text">
              <h1>Montink</h1>
              <p>Empresa</p>
            </div>
          </div>
          <div className="nav-actions">
            <a href="/" className="loja-link">🛍️ Nossa Loja</a>
            <a href="/login" className="admin-link">👤 Área Administrativa</a>
          </div>
        </div>
      </div>

      <div className="institucional-hero">
        <div className="hero-content">
          <h1>Sobre a Montink</h1>
          <p>Inovação, qualidade e excelência em cada produto que oferecemos</p>
        </div>
      </div>

      <div className="institucional-content">
        <section className="sobre-nos">
          <div className="container">
            <div className="section-header">
              <h2>🏢 Nossa História</h2>
              <p>Conheça a trajetória da Montink</p>
            </div>
            
            <div className="historia-grid">
              <div className="historia-texto">
                <h3>Uma empresa construída com propósito</h3>
                <p>
                  Fundada com o objetivo de revolucionar o mercado através da inovação e qualidade, 
                  a Montink se estabeleceu como referência em seu segmento. Nossa missão é oferecer 
                  produtos que fazem a diferença na vida de nossos clientes.
                </p>
                <p>
                  Com anos de experiência e uma equipe dedicada, construímos uma reputação sólida 
                  baseada na confiança, transparência e excelência em tudo que fazemos.
                </p>
              </div>
              
              <div className="historia-stats">
                <div className="stat-item">
                  <div className="stat-number">10+</div>
                  <div className="stat-label">Anos de Experiência</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Clientes Satisfeitos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100+</div>
                  <div className="stat-label">Produtos Oferecidos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="valores">
          <div className="container">
            <div className="section-header">
              <h2>💎 Nossos Valores</h2>
              <p>Os pilares que guiam nossa empresa</p>
            </div>
            
            <div className="valores-grid">
              <div className="valor-item">
                <div className="valor-icon">🎯</div>
                <h3>Excelência</h3>
                <p>Buscamos a perfeição em cada detalhe, garantindo produtos e serviços de alta qualidade.</p>
              </div>
              
              <div className="valor-item">
                <div className="valor-icon">🤝</div>
                <h3>Confiança</h3>
                <p>Construímos relacionamentos duradouros baseados na transparência e integridade.</p>
              </div>
              
              <div className="valor-item">
                <div className="valor-icon">🚀</div>
                <h3>Inovação</h3>
                <p>Estamos sempre em busca de novas soluções e tecnologias para melhor atender nossos clientes.</p>
              </div>
              
              <div className="valor-item">
                <div className="valor-icon">🌱</div>
                <h3>Sustentabilidade</h3>
                <p>Comprometidos com práticas responsáveis e o cuidado com o meio ambiente.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="equipe">
          <div className="container">
            <div className="section-header">
              <h2>👥 Nossa Equipe</h2>
              <p>Profissionais dedicados e especializados</p>
            </div>
            
            <div className="equipe-grid">
              <div className="membro-item">
                <div className="membro-avatar">👨‍💼</div>
                <h3>João Silva</h3>
                <p className="cargo">CEO & Fundador</p>
                <p>Visionário e líder estratégico, com mais de 15 anos de experiência no mercado.</p>
              </div>
              
              <div className="membro-item">
                <div className="membro-avatar">👩‍💻</div>
                <h3>Maria Santos</h3>
                <p className="cargo">CTO</p>
                <p>Especialista em tecnologia e inovação, responsável por nossos sistemas avançados.</p>
              </div>
              
              <div className="membro-item">
                <div className="membro-avatar">👨‍🔬</div>
                <h3>Carlos Oliveira</h3>
                <p className="cargo">Diretor de Produtos</p>
                <p>Especialista em desenvolvimento de produtos com foco na qualidade e inovação.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contato">
          <div className="container">
            <div className="section-header">
              <h2>📞 Entre em Contato</h2>
              <p>Estamos aqui para ajudar você</p>
            </div>
            
            <div className="contato-grid">
              <div className="contato-info">
                <div className="contato-item">
                  <div className="contato-icon">📍</div>
                  <div>
                    <h4>Endereço</h4>
                    <p>Rua das Empresas, 123<br />Centro, São Paulo - SP<br />01234-567</p>
                  </div>
                </div>
                
                <div className="contato-item">
                  <div className="contato-icon">📧</div>
                  <div>
                    <h4>E-mail</h4>
                    <p>contato@montink.com.br<br />vendas@montink.com.br</p>
                  </div>
                </div>
                
                <div className="contato-item">
                  <div className="contato-icon">📱</div>
                  <div>
                    <h4>Telefone</h4>
                    <p>(11) 1234-5678<br />WhatsApp: (11) 99999-9999</p>
                  </div>
                </div>
              </div>
              
              <div className="contato-horarios">
                <h4>🕒 Horários de Atendimento</h4>
                <div className="horario-item">
                  <span>Segunda a Sexta:</span>
                  <span>08:00 às 18:00</span>
                </div>
                <div className="horario-item">
                  <span>Sábados:</span>
                  <span>08:00 às 12:00</span>
                </div>
                <div className="horario-item">
                  <span>Domingos:</span>
                  <span>Fechado</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="institucional-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="logo-icon">M</div>
              <div>
                <h3>Montink</h3>
                <p>Inovação e qualidade desde sempre</p>
              </div>
            </div>
            
            <div className="footer-links">
              <a href="/">Nossa Loja</a>
              <a href="/institucional">Sobre Nós</a>
              <a href="/login">Área Administrativa</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Montink. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Institucional;
