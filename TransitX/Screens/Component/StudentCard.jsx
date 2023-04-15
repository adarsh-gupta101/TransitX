import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';

export default function UserCard(props) {
  const { firstName, lastName, photoUrl, department, branch } = props;
console.log(firstName);
console.log(lastName);
console.log(department);
console.log(branch);
  return (
    <Card style={styles.card}>
      <Card.Title
        title={firstName + ' ' + lastName}
        left={(props) => (
          <Avatar.Image size={50} source={{uri:"https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg"}} {...props} />
        )}
      />
      <Card.Content>
        <View style={styles.detailsContainer}>
          <Title style={styles.title}>Department:</Title>
          <Paragraph style={styles.paragraph}>{department}</Paragraph>
        </View>
        <View style={styles.detailsContainer}>
          <Title style={styles.title}>Branch:</Title>
          <Paragraph style={styles.paragraph}>{branch}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 15,
    width: '90%',

  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  title: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  paragraph: {
    flex: 1,
  },
});
