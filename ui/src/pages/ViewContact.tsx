import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    useIonViewDidEnter,
    IonLoading,
    IonItem,
    IonLabel,
    IonItemDivider,
    IonIcon,
    IonItemGroup
  } from '@ionic/react';
  import React, { useState } from 'react';
  import { RouteComponentProps } from 'react-router';
import { string } from 'prop-types';
import { call, at, person } from 'ionicons/icons';

  interface ViewContactPageProps extends RouteComponentProps<{
    id: string;
  }> {}
  
  const ViewContact: React.FC<ViewContactPageProps> = ({match, history}) => {

    const [showLoading, setShowLoading] = useState(true);
    const [contact, setContact] = useState({
      first_name: string,
      last_name: string,
      email_address: [],
      phone_address: []
    })

    useIonViewDidEnter(() => {
      setShowLoading(true);
      fetch(`${process.env.REACT_APP_SERVER_URL}/contact/view/${match.params.id}`)
      .then(resp => resp.json())
      .then(datas => {
        setShowLoading(false);
        setContact(datas.data)
      })
      .catch(err => {
        console.log(err);
        setShowLoading(false);
        history.goBack();
      });
    });

    
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>

            <IonButtons slot="end">
              <IonButton onClick={() => history.replace(`/edit/${match.params.id}`)} >Edit</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
            {(showLoading)? <IonLoading
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              message={'Loading...'}
            /> : ""}

            {
              (contact)? <>
                <IonItem style={{"marginBottom": 12}} lines="none">
                  <IonIcon slot="start" icon={person}/>
                  <IonLabel> <>{contact.first_name} {contact.last_name}</> </IonLabel>
                </IonItem>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>
                      Mobile
                    </IonLabel>
                  </IonItemDivider>

                  {contact.phone_address.map((phone, index) => (
                    <IonItem key={index} lines="none">
                      <IonIcon slot="start" icon={call}/>
                      <IonLabel>{phone}</IonLabel>
                    </IonItem>
                  ))}
                </IonItemGroup>
                

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>
                      Email Address
                    </IonLabel>
                  </IonItemDivider>
                  {contact.email_address.map((email, index) => (
                    <IonItem key={index} lines="none">
                      <IonIcon slot="start" icon={at}/>
                      <IonLabel>{email}</IonLabel>
                    </IonItem>
                  ))}
                </IonItemGroup>
              </> : ""
            }
        </IonContent>
      </IonPage>
    );
  };
  export default ViewContact;