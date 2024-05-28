import React, { Component } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';

const initValue = `# markmap

- beautiful
- useful
- easy
- interactive
`;

const initPrompt = `Los principios genéticos incluyen la herencia mendeliana, que sigue las leyes de Mendel como la autosómica dominante, autosómica recesiva, dominante ligada a X o recesiva ligada a X. También se incluyen conceptos como homocigoto, heterocigoto, efecto del fundador, epigenético, mosaicismo, neomórfico, entre otros. Estos principios son fundamentales para comprender la genética y la transmisión de enfermedades genéticas.`

export default class MarkmapClass extends Component {
  state = {
    value: initValue,
    prompt: initPrompt
  };

  private svg: SVGSVGElement;
  private mm: Markmap;

  bindSvg = (el) => {
    this.svg = el;
  };

  componentDidMount() {
    this.mm = Markmap.create(this.svg);
    this.updateSvg();
  }

  handlePromptChange = (e) => {
    this.setState({ prompt: e.target.prompt }, this.updateSvg);
  };

  sendPrompt = async (e) => {
    e.target.disabled = true;
    let response = await fetch('http://localhost:1234/v1/chat/completions', {
      method: 'POST',
      mode: "cors", // no-cors
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
        "messages": [
          { "role": "system", "content": "Crea el siguiente texto en formato markmap sin descripciones sin agregar ningun dato, solo usar le contenido del usuario" },
          { "role": "user", "content": this.state.prompt }
        ],
        "temperature": 0.0,
        "max_tokens": -1,
        "stream": false
      })
    })

    try {
      response.json().then((data) => this.handleChange({ target: { value: data.choices[0].message.content } }));
    } catch (error) {
      console.log('error', error);
    } finally {
      e.target.disabled = false;
    }
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value }, this.updateSvg);
  };

  updateSvg = () => {
    const { root } = transformer.transform(this.state.value);
    this.mm.setData(root);
    this.mm.fit();
  };

  render() {
    const { value, prompt } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', height: '200px', alignItems: 'center' }}>
          <textarea
            style={{ width: '100%', height: '100%' }}
            className=""
            value={prompt}
            onChange={this.handlePromptChange}
          />
          <button type="submit" onClick={this.sendPrompt} style={{height: 'auto'}}>Generate</button>
          <textarea
            style={{ width: '100%', height: '100%'}}
            className=""
            value={value}
            onChange={this.handleChange}
          />
        </div>
        <svg
          style={{ width: '100%', height: '300px' }}
          className="" ref={this.bindSvg} />
      </div>
    );
  }
}
