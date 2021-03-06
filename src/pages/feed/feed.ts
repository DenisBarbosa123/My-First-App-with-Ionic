import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {MoovieProvider} from '../../providers/moovie/moovie'
import { FilmesDetalhesPage } from '../filmes-detalhes/filmes-detalhes';
/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
  providers:[
    MoovieProvider
  ]
})
export class FeedPage {
  public object_feed = { // criando json e passando para variavel 
    titulo:"Denis Barbosa",
    data: "November, 5, 2019",
    descricao: "Estou criando um app incrivel...",
    qtd_like: 12,
    qtd_coment: 10,
    time_coment: "12h ago"
  }
  public lista_filmes = new Array<any>();
  public nome_usuario:string = 'Denis Barbosa';//variavel do tipo string
  public loader;
  public refresher;
  public isRefreshing:boolean = false;
  public lastPage = 1;
  public infiniteScroll;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private movieProvider: MoovieProvider,
    public loadingCtrl: LoadingController ) {
  }

  openLoading() { //abre tela de carregando
    //console.log('carregando...');
      this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

  closeLoading(){ //fecha tela de carregando
    //console.log('terminou de carregar...');
    this.loader.dismiss();
  }

  doRefresh(refresher) {//metodo que atualiza lista de filmes
    this.refresher = refresher;
    this.isRefreshing=true;
    this.carregarFilmes();
  }

  ionViewDidEnter() {//metodo que carrega junto com tela
    this.carregarFilmes();
  }

  abrirDetalhes(filme){//faz abrir a pagina detalhes do filme
    console.log(filme);
    this.navCtrl.push(FilmesDetalhesPage, {id: filme.id});
  }

  doInfinite(infiniteScroll) {
    this.lastPage++;
    this.infiniteScroll = infiniteScroll;
    this.carregarFilmes(true);
    infiniteScroll.complete();
  }


  carregarFilmes(newPage: boolean = false){
    this.openLoading();
    //console.log('abrindo filmes...');
    this.movieProvider.getLetesMovies(this.lastPage).subscribe(
      data=>{
        const response = (data as any);//casting data for any
        const objeto_retorno = JSON.parse(response._body);//faz parse de json para objeto

        if(newPage){
          this.lista_filmes = this.lista_filmes.concat(objeto_retorno.results);
          console.log(this.lastPage);
          console.log(this.lista_filmes);
          this.infiniteScroll.complete();
          

        }else{
          this.lista_filmes = objeto_retorno.results;
        }
        
        
        //console.log(objeto_retorno); 
        this.closeLoading();
        if(this.isRefreshing){
          this.refresher.complete();
          this.isRefreshing=false;
        }
      }, error=>{
        console.log(error);
        this.closeLoading();
        if(this.isRefreshing){
          this.refresher.complete();
          this.isRefreshing=false;

        }
      }
    )
  }

}
