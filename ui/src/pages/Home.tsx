import { 
  IonContent, 
  IonHeader, 
  IonPage,
  IonTitle,
  IonButtons,
  IonSearchbar,
  IonIcon,
  IonButton,
  IonToolbar, 
  IonList,
  IonItem,
  IonLabel,
  useIonViewDidEnter,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLoading
} from '@ionic/react';
import React, { useState } from 'react';
import { contact } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { SearchbarChangeEventDetail } from '@ionic/core';
// import {SERVER_URL} from '../../environment.js';

const Home: React.FC<RouteComponentProps> = (props) => {

  const [showLoading, setShowLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  const doSearch = (s: string) => {
    const url = (`${process.env.REACT_APP_SERVER_URL}/contact/search`)
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'query': s})
    })
    .then(resp => resp.json())
    .then(datas => {
      setContacts(datas.data)
    })
    .catch(err => {
      console.log(err);
    });
  }

  const findAll = () => {
    setShowLoading(true)
    fetch(`${process.env.REACT_APP_SERVER_URL}/contact/all`)
    .then(resp => resp.json())
    .then(datas => {
      setShowLoading(false)
      setContacts(datas.data)
    })
    .catch(err => {
      console.log(err);
      setShowLoading(false);
    });
  }

  const onContactDelete = (id: number) => {
    setShowLoading(true)
    fetch(`${process.env.REACT_APP_SERVER_URL}/contact/delete/${id}`)
    .then(resp => resp.json())
    .then(datas => {
      findAll()
    })
    .catch(err => {
      console.log(err);
    });
  }

  const searchContact = (e : CustomEvent<SearchbarChangeEventDetail>) => {
    const search = e.detail.value
    if (search) {
      doSearch(search)
    } else {
      findAll()
    }
  };

  
  useIonViewDidEnter(() => {
    findAll();
  });


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>

          <IonTitle> Contacts</IonTitle>

          <IonButtons slot="primary">
            <IonButton onClick={() => props.history.push('/new')}>
              <IonIcon slot="icon-only" icon={contact} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSearchbar placeholder="Search" onIonChange={searchContact}></IonSearchbar>
        <IonList>
          {(showLoading)? <>
            <IonItem>
              <IonLabel>No Contacts</IonLabel>
            </IonItem>
            <IonLoading
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              message={'Loading...'}
            />
          </> : ((contacts.length === 0)? 
          <IonItem>
            <IonLabel>No Contacts</IonLabel>
          </IonItem> : contacts.map(myContact => {
            return (
              <IonItemSliding key={myContact['id']}>
                <IonItem routerLink={`/view/${myContact['id']}`} routerDirection="forward" detail={false} >
                  <IonLabel>{myContact['first_name']} {myContact['last_name']}</IonLabel>
                </IonItem>

                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={(e) => {onContactDelete(myContact['id'])}}>Delete</IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            )
          }
          ))
          
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
